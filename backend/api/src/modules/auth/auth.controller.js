exports.login = async (req, res) => {
  const { password } = req.body;
  const adminSecret = process.env.ADMIN_SECRET;

  if (password === adminSecret) {
    res.status(200).json({ 
      success: true, 
      message: "Login Successful",
      token: adminSecret // Simple rakhte hain, wahi secret bhej rahe hain
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Bhai, galat password hai!" 
    });
  }
};