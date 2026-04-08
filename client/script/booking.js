document.addEventListener('DOMContentLoaded', function() {
   
    const timeButtons = document.querySelectorAll('.time-btn');
    const hiddenInput = document.getElementById('selected-time-value');

    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('active')) return;

            const currentActive = document.querySelector('.time-btn.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            
            this.classList.add('active');
            
            if (hiddenInput) {
                hiddenInput.value = this.textContent.trim();
            }

            console.log("Khung giờ đã chọn: " + hiddenInput.value);
        });
    });

    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            const finalTime = hiddenInput.value;
            if (!finalTime) {
                alert("Vui lòng chọn khung giờ đặt bàn!");
                e.preventDefault();
            }
        });
    }
});