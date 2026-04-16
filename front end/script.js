
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const card = document.getElementById('card').value.replace(/\s/g, '');
    const product = JSON.parse(localStorage.getItem('selectedProduct') || '{}');

    let valid = true;
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    // Name validation
    if (name.length < 2) {
        document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
        valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Enter valid email';
        valid = false;
    }

    // Card validation
    if (!/^\d{16}$/.test(card)) {
        document.getElementById('cardError').textContent = 'Card must be exactly 16 digits';
        valid = false;
    }

    if (!product.id) {
        alert("No product selected");
        return;
    }

    if (!valid) return;

    try {
        const res = await fetch("http://localhost:4000/api/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobile: {
                    brand: product.brand,
                    model: product.model,
                    price: product.price
                },
                customer: {
                    name: name,
                    email: email
                },
                cardNumber: card,
                totalAmount: product.price.replace('$', '')
            })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('order', JSON.stringify(data));
            window.location.href = 'success.html';
        } else {
            alert(data.message || "Payment Failed");
        }

    } catch (err) {
        alert("Backend server not running");
        console.error(err);
    }
});