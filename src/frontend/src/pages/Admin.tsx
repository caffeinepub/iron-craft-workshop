import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, LogOut, Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ContactInfo, CreateProductInput, Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  ProductCategory,
  useBulkUpdatePrices,
  useCreateProduct,
  useDeleteProduct,
  useGetAllProducts,
  useGetContactInfo,
  useIsCallerAdmin,
  useUpdateContactInfo,
  useUpdateProduct,
} from "../hooks/useQueries";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function timeAgo(nanoTs: bigint) {
  const ms = Number(nanoTs / 1_000_000n);
  const diffDays = Math.floor((Date.now() - ms) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export default function Admin() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const qc = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin } = useIsCallerAdmin();
  const { data: products = [] } = useGetAllProducts();
  const { data: contactInfo } = useGetContactInfo();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const bulkUpdate = useBulkUpdatePrices();
  const updateContact = useUpdateContactInfo();

  const [newProduct, setNewProduct] = useState<CreateProductInput>({
    name: "",
    unit: "per piece",
    isAvailable: true,
    description: "",
    imageUrl: "",
    category: ProductCategory.door,
    price: 0,
  });
  const [addOpen, setAddOpen] = useState(false);
  const [editPrices, setEditPrices] = useState<Record<string, string>>({});
  const [bulkPercent, setBulkPercent] = useState("");
  const [bulkCategory, setBulkCategory] = useState<ProductCategory | "all">(
    "all",
  );
  const [contactForm, setContactForm] = useState<ContactInfo>({
    phone: contactInfo?.phone ?? "+1 (555) 987-6543",
    address: contactInfo?.address ?? "42 Industrial Ave, Steel City, TX 75001",
    email: contactInfo?.email ?? "info@ironcraft.com",
    workingHours:
      contactInfo?.workingHours ?? "Mon–Fri: 8AM–6PM | Sat: 9AM–3PM",
    mapLink: contactInfo?.mapLink ?? "",
  });

  const handleLogin = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (err: any) {
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync({
        ...newProduct,
        price: Number(newProduct.price),
      });
      toast.success("Product added!");
      setAddOpen(false);
      setNewProduct({
        name: "",
        unit: "per piece",
        isAvailable: true,
        description: "",
        imageUrl: "",
        category: ProductCategory.door,
        price: 0,
      });
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleSavePrice = async (product: Product) => {
    const newPrice = Number.parseFloat(editPrices[product.id.toString()] ?? "");
    if (Number.isNaN(newPrice) || newPrice <= 0) {
      toast.error("Invalid price");
      return;
    }
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        input: { price: newPrice },
      });
      toast.success("Price updated!");
      setEditPrices((p) => {
        const n = { ...p };
        delete n[product.id.toString()];
        return n;
      });
    } catch {
      toast.error("Failed to update price");
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleBulkUpdate = async () => {
    const pct = Number.parseFloat(bulkPercent);
    if (Number.isNaN(pct)) {
      toast.error("Enter a valid percentage");
      return;
    }
    const targetProducts =
      bulkCategory === "all"
        ? products
        : products.filter((p) => p.category === bulkCategory);
    const updates = targetProducts.map((p) => ({
      productId: p.id,
      newPrice: Math.round(p.price * (1 + pct / 100) * 100) / 100,
    }));
    try {
      await bulkUpdate.mutateAsync(updates);
      toast.success(
        `Prices updated by ${pct > 0 ? "+" : ""}${pct}% for ${updates.length} products`,
      );
      setBulkPercent("");
    } catch {
      toast.error("Bulk update failed");
    }
  };

  const handleContactSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContact.mutateAsync(contactForm);
      toast.success("Contact info updated!");
    } catch {
      toast.error("Failed to update contact info");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-primary/10 border border-primary flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-black text-3xl tracking-widest uppercase mb-3">
            ADMIN PANEL
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to manage products and site settings.
          </p>
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="font-heading font-black text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 w-full hover:bg-primary/90 disabled:opacity-50 transition-colors uppercase flex items-center justify-center gap-2"
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h1 className="font-heading font-black text-3xl tracking-widest uppercase mb-3 text-destructive">
            ACCESS DENIED
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            You do not have admin privileges.
          </p>
          <button
            type="button"
            onClick={handleLogin}
            className="font-heading font-bold text-sm text-muted-foreground underline"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4 inline mr-1" />
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[72px] min-h-screen bg-background">
      <section className="bg-section-band py-10 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-black text-4xl tracking-widest uppercase">
              ADMIN PANEL
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage products, prices and site info
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="font-heading font-bold text-xs tracking-widest text-muted-foreground border border-border px-4 py-2 hover:border-destructive hover:text-destructive transition-colors flex items-center gap-2"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4" /> SIGN OUT
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Tabs defaultValue="products" data-ocid="admin.tab">
          <TabsList className="bg-card border border-border mb-8">
            <TabsTrigger
              value="products"
              className="font-heading font-bold text-xs tracking-widest"
            >
              PRODUCTS
            </TabsTrigger>
            <TabsTrigger
              value="prices"
              className="font-heading font-bold text-xs tracking-widest"
            >
              BULK PRICES
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="font-heading font-bold text-xs tracking-widest"
            >
              CONTACT INFO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-black text-xl tracking-widest uppercase">
                PRODUCT LIST ({products.length})
              </h2>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="font-heading font-black text-xs tracking-widest bg-primary text-primary-foreground px-5 py-2 hover:bg-primary/90 transition-colors uppercase flex items-center gap-2"
                    data-ocid="admin.open_modal_button"
                  >
                    <Plus className="w-4 h-4" /> ADD PRODUCT
                  </button>
                </DialogTrigger>
                <DialogContent
                  className="bg-card border-border max-w-lg"
                  data-ocid="admin.dialog"
                >
                  <DialogHeader>
                    <DialogTitle className="font-heading font-black tracking-widest uppercase">
                      ADD NEW PRODUCT
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleAddProduct}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-1 block">
                        NAME *
                      </Label>
                      <Input
                        required
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct((p) => ({ ...p, name: e.target.value }))
                        }
                        className="bg-input border-border"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-1 block">
                          CATEGORY *
                        </Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(v) =>
                            setNewProduct((p) => ({
                              ...p,
                              category: v as ProductCategory,
                            }))
                          }
                        >
                          <SelectTrigger
                            className="bg-input border-border"
                            data-ocid="admin.select"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value={ProductCategory.door}>
                              Door
                            </SelectItem>
                            <SelectItem value={ProductCategory.window_}>
                              Window
                            </SelectItem>
                            <SelectItem value={ProductCategory.gate}>
                              Gate
                            </SelectItem>
                            <SelectItem value={ProductCategory.other}>
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-1 block">
                          PRICE ($) *
                        </Label>
                        <Input
                          required
                          type="number"
                          min={0}
                          value={newProduct.price || ""}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              price: Number.parseFloat(e.target.value),
                            }))
                          }
                          className="bg-input border-border"
                          data-ocid="admin.input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-1 block">
                        UNIT
                      </Label>
                      <Input
                        value={newProduct.unit}
                        onChange={(e) =>
                          setNewProduct((p) => ({ ...p, unit: e.target.value }))
                        }
                        className="bg-input border-border"
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-1 block">
                        DESCRIPTION *
                      </Label>
                      <Textarea
                        required
                        rows={3}
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        className="bg-input border-border resize-none"
                        data-ocid="admin.textarea"
                      />
                    </div>
                    <div>
                      <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-1 block">
                        IMAGE URL
                      </Label>
                      <Input
                        value={newProduct.imageUrl ?? ""}
                        onChange={(e) =>
                          setNewProduct((p) => ({
                            ...p,
                            imageUrl: e.target.value,
                          }))
                        }
                        placeholder="/assets/..."
                        className="bg-input border-border"
                        data-ocid="admin.input"
                      />
                    </div>
                    <DialogFooter>
                      <button
                        type="button"
                        onClick={() => setAddOpen(false)}
                        className="font-heading font-bold text-xs tracking-widest border border-border px-5 py-2 hover:border-primary transition-colors uppercase"
                        data-ocid="admin.cancel_button"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        disabled={createProduct.isPending}
                        className="font-heading font-black text-xs tracking-widest bg-primary text-primary-foreground px-6 py-2 hover:bg-primary/90 disabled:opacity-50 transition-colors uppercase flex items-center gap-2"
                        data-ocid="admin.submit_button"
                      >
                        {createProduct.isPending && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}{" "}
                        SAVE
                      </button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {products.length === 0 && (
              <div
                className="text-center py-16 text-muted-foreground border border-border"
                data-ocid="admin.empty_state"
              >
                <div className="font-heading font-bold tracking-widest text-sm">
                  NO PRODUCTS YET
                </div>
              </div>
            )}

            <div
              className="border border-border overflow-x-auto"
              data-ocid="admin.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-heading font-bold text-xs tracking-widest text-primary">
                      NAME
                    </TableHead>
                    <TableHead className="font-heading font-bold text-xs tracking-widest text-primary">
                      CATEGORY
                    </TableHead>
                    <TableHead className="font-heading font-bold text-xs tracking-widest text-primary">
                      PRICE
                    </TableHead>
                    <TableHead className="font-heading font-bold text-xs tracking-widest text-primary">
                      LAST UPDATED
                    </TableHead>
                    <TableHead className="font-heading font-bold text-xs tracking-widest text-primary">
                      UPDATE PRICE
                    </TableHead>
                    <TableHead className="font-heading font-bold text-xs tracking-widest text-primary">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, i) => (
                    <TableRow
                      key={product.id.toString()}
                      className="border-border"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground text-sm">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-primary font-heading font-black">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {timeAgo(product.lastUpdated)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            placeholder={String(product.price)}
                            value={editPrices[product.id.toString()] ?? ""}
                            onChange={(e) =>
                              setEditPrices((p) => ({
                                ...p,
                                [product.id.toString()]: e.target.value,
                              }))
                            }
                            className="bg-input border-border w-24 h-8 text-sm"
                            data-ocid="admin.input"
                          />
                          <button
                            type="button"
                            onClick={() => handleSavePrice(product)}
                            disabled={!editPrices[product.id.toString()]}
                            className="font-heading font-bold text-xs bg-primary text-primary-foreground px-3 py-1 hover:bg-primary/90 disabled:opacity-30 transition-colors"
                            data-ocid={`admin.save_button.${i + 1}`}
                          >
                            SAVE
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="prices">
            <div className="max-w-md">
              <h2 className="font-heading font-black text-xl tracking-widest uppercase mb-6">
                BULK PRICE UPDATE
              </h2>
              <div className="bg-card border border-border p-6 flex flex-col gap-5">
                <div>
                  <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-2 block">
                    CATEGORY
                  </Label>
                  <Select
                    value={bulkCategory}
                    onValueChange={(v) =>
                      setBulkCategory(v as ProductCategory | "all")
                    }
                  >
                    <SelectTrigger
                      className="bg-input border-border"
                      data-ocid="admin.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value={ProductCategory.door}>
                        Doors
                      </SelectItem>
                      <SelectItem value={ProductCategory.window_}>
                        Windows
                      </SelectItem>
                      <SelectItem value={ProductCategory.gate}>
                        Gates
                      </SelectItem>
                      <SelectItem value={ProductCategory.other}>
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-2 block">
                    PERCENTAGE CHANGE (%)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5 (increase) or -3 (decrease)"
                    value={bulkPercent}
                    onChange={(e) => setBulkPercent(e.target.value)}
                    className="bg-input border-border"
                    data-ocid="admin.input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Positive = price increase, negative = price decrease
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBulkUpdate}
                  disabled={bulkUpdate.isPending || !bulkPercent}
                  className="font-heading font-black text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 disabled:opacity-50 transition-colors uppercase flex items-center justify-center gap-2"
                  data-ocid="admin.primary_button"
                >
                  {bulkUpdate.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  APPLY UPDATE
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="max-w-lg">
              <h2 className="font-heading font-black text-xl tracking-widest uppercase mb-6">
                UPDATE CONTACT INFO
              </h2>
              <form
                onSubmit={handleContactSave}
                className="bg-card border border-border p-6 flex flex-col gap-4"
                data-ocid="admin.modal"
              >
                {(
                  [
                    { key: "phone", label: "PHONE", type: "text" },
                    { key: "email", label: "EMAIL", type: "email" },
                    { key: "address", label: "ADDRESS", type: "text" },
                    {
                      key: "workingHours",
                      label: "WORKING HOURS",
                      type: "text",
                    },
                    { key: "mapLink", label: "MAP LINK (URL)", type: "url" },
                  ] as const
                ).map(({ key, label, type }) => (
                  <div key={key}>
                    <Label className="font-heading font-bold text-xs tracking-widest text-primary mb-1 block">
                      {label}
                    </Label>
                    <Input
                      type={type}
                      value={contactForm[key]}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className="bg-input border-border"
                      data-ocid="admin.input"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={updateContact.isPending}
                  className="font-heading font-black text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 disabled:opacity-50 transition-colors uppercase flex items-center justify-center gap-2 mt-2"
                  data-ocid="admin.submit_button"
                >
                  {updateContact.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  SAVE CONTACT INFO
                </button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
