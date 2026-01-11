const Cart = {
    key: 'caramin_cart',
    
    getItems() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    },
    
    saveItems(items) {
        localStorage.setItem(this.key, JSON.stringify(items));
        this.updateCount();
    },
    
    add(product) {
        const items = this.getItems();
        const existing = items.find(i => i.id === product.id);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            items.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveItems(items);
        
        // Visual feedback
        const btn = document.querySelector(`button[data-id="${product.id}"]`);
        if (btn) {
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined text-base">check</span>';
            btn.classList.add('bg-green-500', 'text-white');
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.classList.remove('bg-green-500', 'text-white');
            }, 1500);
        } else {
             alert('Product added to cart!');
        }
    },
    
    remove(id) {
        const items = this.getItems();
        const filtered = items.filter(i => i.id !== id);
        this.saveItems(filtered);
        this.render();
    },
    
    updateQuantity(id, change) {
        const items = this.getItems();
        const item = items.find(i => i.id === id);
        
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.remove(id);
                return;
            }
            this.saveItems(items);
            this.render();
        }
    },
    
    updateCount() {
        const items = this.getItems();
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        const badges = document.querySelectorAll('.cart-count-badge');
        badges.forEach(b => {
            b.textContent = count;
            // Hide badge if count is 0, optional but cleaner
            if (count === 0) {
                b.classList.add('opacity-0');
            } else {
                b.classList.remove('opacity-0');
            }
        });
    },
    
    render() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;
        
        const items = this.getItems();
        
        if (items.length === 0) {
            container.innerHTML = '<div class="text-center py-10"><p class="text-onyx/60">Your cart is empty.</p></div>';
            this.updateTotals(0);
            return;
        }
        
        container.innerHTML = items.map(item => `
            <div class="grid grid-cols-12 gap-6 items-center border-b border-border-pink pb-8 mb-8 last:border-0 last:pb-0 last:mb-0">
                <div class="col-span-12 md:col-span-6 flex gap-6 items-center">
                    <div class="w-24 h-24 rounded-2xl bg-gray-100 bg-cover bg-center shrink-0 shadow-sm border border-border-pink" style="background-image: url('${item.image}');"></div>
                    <div>
                        <h3 class="font-serif font-bold text-lg text-onyx leading-tight">${item.name}</h3>
                        <p class="text-xs text-onyx/60 font-sans mt-1.5 font-medium">Digital Product</p>
                        <button onclick="Cart.remove('${item.id}')" class="text-[10px] font-bold uppercase tracking-[1px] text-primary mt-3 hover:text-onyx transition-colors font-sans flex items-center gap-1 group">
                            <span class="material-symbols-outlined text-[14px] group-hover:scale-110 transition-transform">delete</span> Remove
                        </button>
                    </div>
                </div>
                <div class="col-span-4 md:col-span-2 text-left md:text-center font-sans font-bold text-onyx/80">£${item.price.toFixed(2)}</div>
                <div class="col-span-4 md:col-span-2 flex justify-center">
                    <div class="flex items-center border border-border-pink rounded-full h-10 px-1 bg-background-light">
                        <button onclick="Cart.updateQuantity('${item.id}', -1)" class="w-8 h-full flex items-center justify-center text-onyx/60 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">remove</span></button>
                        <input class="w-8 bg-transparent border-none text-center font-sans font-bold text-sm p-0 focus:ring-0 text-onyx" type="number" value="${item.quantity}" readonly/>
                        <button onclick="Cart.updateQuantity('${item.id}', 1)" class="w-8 h-full flex items-center justify-center text-onyx/60 hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">add</span></button>
                    </div>
                </div>
                <div class="col-span-4 md:col-span-2 text-right font-sans font-bold text-onyx text-lg pr-1 md:pr-0">£${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
        
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.updateTotals(total);
    },
    
    updateTotals(total) {
        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total');
        if (subtotalEl) subtotalEl.textContent = `£${total.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `£${total.toFixed(2)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCount();
    Cart.render();
});
