const nameRegux = /^[A-Za-z]{2,30}$/;

const emailRegux = /^[^\s@]+@[^\s@]+\.[^s@]+$/;

const passwordRegux = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

app.post("/api/resigter", (req, res) => {
    const {firstName, lastName, email, password, confirmPassword } = req.body;

    if(!nameRegux.test(firstName)){
        return res.status(400).json({message: "Invalid First Name"})
    }

    if(!nameRegux.test(lastName)){
        return res.status(400).json({message: "Invalid Last name"})
    }

    if(!emailRegux.test(email)){
        return res.status(400).json({message: "Invalid Email Address"})
    }

    if(!password.test(password)){
        return res.status(400).json({message: "Password must be 8+ Chars."})
    }

    if(password !== confirmPassword){
        return res.status(400).json({message: "Password do not Match"})
    }
    res.status(200).json({message: "User registered Succesfully"})
})