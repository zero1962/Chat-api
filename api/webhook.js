// webhook.js の中身を一時的にこれにする！
module.exports = async (req, res) => {
  console.log("🫧 リクエスト受信:", req.body); // ← これが出れば届いてる！

  try {
    res.status(200).send("OK");
  } catch (error) {
    console.error("🌪️ エラー:", error);
    res.status(500).send("エラー発生");
  }
};
