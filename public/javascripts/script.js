
    console.log("js working")

    // get all radio buttons with name "flexRadioDefault"
    const paymentMethods = document.getElementsByName("flexRadioDefault");

    // loop through all radio buttons
    for (let i = 0; i < paymentMethods.length; i++) {
        // check if the current radio button is checked
        if (paymentMethods[i].checked) {
            // print the value of the checked radio button
            console.log(paymentMethods[i].value);
            // or return the value of the checked radio button
            return paymentMethods[i].value;
        }
    }
