// webhook.js の中身を一時的にこれにする！
module.exports = async (req, res) => {
  console.log("🫧 Webhookが呼ばれました！", req.body);
  setTimeout(() => {
    console.log("🫧 遅延ログ:", req.body);
  }, 10);
  console.log("🫧 リクエスト受信:", req.body); // ← これが出れば届いてる！
  console.log("🫧 リクエスト受信:");
  console.dir(req.body, { depth: null });
  try {
    res.status(200).send("OK");
  } catch (error) {
    console.error("🌪️ エラー:", error);
    res.status(500).send("エラー発生");
  }
};
