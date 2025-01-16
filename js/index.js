    const toggleSwitch = document.getElementById('toggleSwitch');
    const formTitle = document.getElementById('form-title');
    const nameField = document.getElementById('name');

    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            formTitle.textContent = 'Signup';
            nameField.parentElement.style.display = 'block';
            nameField.required = true;
            toggleSwitch.nextElementSibling.textContent = 'Switch to Login';
        } else {
            formTitle.textContent = 'Login';
            nameField.parentElement.style.display = 'none';
            nameField.required = false;
            toggleSwitch.nextElementSibling.textContent = 'Switch to Signup';
        }
    });

    const cancelForm = () => {
        document.getElementById('authForm').reset();
    };

    // Initialize with Login view
    nameField.parentElement.style.display = 'none';
    nameField.required = false;

    