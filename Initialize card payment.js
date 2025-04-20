function initiateCardPayment() {
    FlutterwaveCheckout({
      public_key: "YOUR_FLUTTERWAVE_PUBLIC_KEY",
      tx_ref: "TX_REF_" + Date.now(),
      amount: 100, // Amount in currency (e.g., 100 USD)
      currency: "USD", // Use your preferred currency (NGN, KES, USD, etc.)
      payment_options: "card", // Force card payments (or leave blank for all options)
      customer: {
        email: "user@example.com",
        phone_number: "1234567890",
        name: "John Doe",
      },
      callback: function (response) {
        // Verify transaction on your server
        if (response.status === "successful") {
          window.location.href = "/success.html";
        } else {
          alert("Payment failed.");
        }
      },
      onclose: function () {
        // Handle modal closure
      },
    });
  }