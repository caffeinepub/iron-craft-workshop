import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type ProductId = Nat;
  type PriceRecord = {
    price : Float;
    timestamp : Int;
  };

  type ProductCategory = {
    #door;
    #window;
    #gate;
    #other;
  };

  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    category : ProductCategory;
    price : Float;
    unit : Text;
    imageUrl : ?Text;
    isAvailable : Bool;
    lastUpdated : Int;
    priceHistory : [PriceRecord];
  };

  type ContactInfo = {
    phone : Text;
    address : Text;
    email : Text;
    workingHours : Text;
    mapLink : Text;
  };

  type CreateProductInput = {
    name : Text;
    description : Text;
    category : ProductCategory;
    price : Float;
    unit : Text;
    imageUrl : ?Text;
    isAvailable : Bool;
  };

  type UpdateProductInput = {
    name : ?Text;
    description : ?Text;
    category : ?ProductCategory;
    price : ?Float;
    unit : ?Text;
    imageUrl : ?Text;
    isAvailable : ?Bool;
  };

  type BulkPriceUpdateInput = {
    productId : Nat;
    newPrice : Float;
  };

  public type UserProfile = {
    name : Text;
  };

  // State
  var nextProductId = 1;
  let products = Map.empty<ProductId, Product>();
  var contactInfo : ?ContactInfo = null;
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management
  public shared ({ caller }) func createProduct(input : CreateProductInput) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let id = nextProductId;
    nextProductId += 1;

    let timestamp = Time.now();
    let priceHistory = [{
      price = input.price;
      timestamp = timestamp;
    }];

    let product : Product = {
      id;
      name = input.name;
      description = input.description;
      category = input.category;
      price = input.price;
      unit = input.unit;
      imageUrl = input.imageUrl;
      isAvailable = input.isAvailable;
      lastUpdated = timestamp;
      priceHistory;
    };

    products.add(id, product);
    id;
  };

  public query ({ caller }) func getProduct(productId : ProductId) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getProductPriceHistory(productId : ProductId) : async [PriceRecord] {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product.priceHistory };
    };
  };

  public shared ({ caller }) func updateProduct(productId : ProductId, input : UpdateProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    let existingProduct = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };

    let timestamp = Time.now();

    // Handle price update and history
    let newPrice = switch (input.price) {
      case (null) { existingProduct.price };
      case (?p) { p };
    };

    let newPriceHistory = if (input.price != null and input.price != ?existingProduct.price) {
      let newRecord = [{
        price = newPrice;
        timestamp = timestamp;
      }];
      let combined = newRecord.concat(existingProduct.priceHistory);
      let limited = Array.tabulate(
        Nat.min(5, combined.size()),
        func(i) { combined[i] }
      );
      limited;
    } else {
      existingProduct.priceHistory;
    };

    let updatedProduct : Product = {
      id = existingProduct.id;
      name = switch (input.name) {
        case (null) { existingProduct.name };
        case (?new) { new };
      };
      description = switch (input.description) {
        case (null) { existingProduct.description };
        case (?new) { new };
      };
      category = switch (input.category) {
        case (null) { existingProduct.category };
        case (?new) { new };
      };
      price = newPrice;
      unit = switch (input.unit) {
        case (null) { existingProduct.unit };
        case (?new) { new };
      };
      imageUrl = switch (input.imageUrl) {
        case (null) { existingProduct.imageUrl };
        case (?new) { ?new };
      };
      isAvailable = switch (input.isAvailable) {
        case (null) { existingProduct.isAvailable };
        case (?new) { new };
      };
      lastUpdated = timestamp;
      priceHistory = newPriceHistory;
    };

    products.add(productId, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (products.containsKey(productId)) {
      products.remove(productId);
    } else {
      Runtime.trap("Product does not exist");
    };
  };

  public shared ({ caller }) func bulkUpdatePrices(updates : [BulkPriceUpdateInput]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can bulk update prices");
    };

    let timestamp = Time.now();

    updates.forEach(func(update) {
      let existingProduct = switch (products.get(update.productId)) {
        case (null) { Runtime.trap("Product does not exist") };
        case (?product) { product };
      };

      let newPriceHistory = [{
        price = update.newPrice;
        timestamp = timestamp;
      }];

      let combined = newPriceHistory.concat(existingProduct.priceHistory);
      let limitedHistory = Array.tabulate(
        Nat.min(5, combined.size()),
        func(i) { combined[i] }
      );

      let updatedProduct : Product = {
        id = existingProduct.id;
        name = existingProduct.name;
        description = existingProduct.description;
        category = existingProduct.category;
        price = update.newPrice;
        unit = existingProduct.unit;
        imageUrl = existingProduct.imageUrl;
        isAvailable = existingProduct.isAvailable;
        lastUpdated = timestamp;
        priceHistory = limitedHistory;
      };

      products.add(update.productId, updatedProduct);
    });
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : ProductCategory) : async [Product] {
    products.values().toArray().filter(
      func(p) { p.category == category }
    );
  };

  // Contact Info Management
  public shared ({ caller }) func updateContactInfo(input : ContactInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact info");
    };
    contactInfo := ?input;
  };

  public query ({ caller }) func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };
};
