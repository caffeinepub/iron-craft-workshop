# Iron Craft Workshop

## Current State
New project. No existing implementation.

## Requested Changes (Diff)

### Add
- Product catalog page listing iron doors, windows, gates with photos, descriptions, and prices
- Dynamic pricing system: admin can update prices at any time (daily/weekly)
- Contact information section with phone, address, working hours
- Admin panel (protected by login) to manage products and update prices
- Role-based access: public visitors see the catalog; admin can edit prices

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select `authorization` component for admin login
2. Generate Motoko backend with:
   - Product data model (name, description, category, price, unit)
   - CRUD operations for products (admin only)
   - Public read access for product listing
   - Contact info storage (admin editable)
3. Build frontend:
   - Homepage with hero section and workshop highlights
   - Products page with grid of products and current prices
   - Contact section with info and a simple enquiry form
   - Admin dashboard (behind login) to update product prices
