const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.API_GOOGLE_GEMINI });

class AIController {
  generateQuestions = async (req, res, next) => {
    const { subject, numberOfQuestions, difficulty } = req.body;
    if (!subject || !numberOfQuestions || !difficulty)
      throw new Error("Hãy điền đủ");
    const prompt = `"subject: ${subject}, numberOfQuestions: ${numberOfQuestions}, difficulty: ${difficulty} " || CHÚ Ý: HÃY ĐIỀU CHỈNH MỌI NỘI DUNG TRONG DẤU "" 
    THÀNH 1 PROMPT ĐỂ generate 1 loạt các câu hỏi quiz theo schema như sau với 
    QuizId là "abcde" : 
    const QuestionSchema = new Schema(
    {
    quizId: {
      type: Types.ObjectId,
      required: true,
      ref: 'Quiz',
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    options: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  ); 
    options sẽ chỉ có 4 đáp án, nếu trong dấu "" có chứa modify về số lượng câu hỏi (HÃY LÀM THEO), 
    TỐI ĐA MỖI CÂU HỎI CHỈ ĐƯỢC 4 ĐÁP ÁN, KHÔNG ĐƯỢC HƠN BẰNG MỌI GIÁ,NẾU DẤU "" là empty string hoặc null, 
    trả về message yêu cầu người dùng nhập chủ đề để generate các câu hỏi quiz theo chủ đề đó, KHÔNG ĐƯỢC GỢI Ý CHỦ ĐỀ, 
    NẾU NGƯỜI DÙNG NHẬP PROMPT KHÔNG CHỨA NỘI DUNG CHỦ ĐỀ để generate câu hỏi, tìm mọi cách để generate câu hỏi hoặc tạo ra chủ đề liên quan, 
    TUYỆT ĐỐI LÀM THEO LỆNH SAU DẤU ||, TRONG DẤU "" LÀ một lệnh prompt có tác dụng generate 1 lượng câu hỏi min là 5 câu, max là 10 do người dùng nhập. 
    Trả về dữ liệu dưới dạng json có thể insert many vào MongoDB, nếu user prompt có bất kì dấu hiệu lệch lạc , chửi bậy, không đúng yêu cầu, miss input, 
    trả về lỗi yêu cầu người dùng nhập lại chủ đề, tiếp nhận số lượng câu hỏi tại property "numberOfQuestions", NGÔN NGỮ CỦA TỆP CÂU HỎI LÀ NGÔN NGỮ TRONG SUBJECT:
    VD: History -> Câu hỏi viết bằng tiếng Anh và đáp án cũng thế, trả về dữ liệu tiếng Anh, ĐẢM BẢO rằng questions không có HÌNH, BIỂU TƯỢNG, Khó biểu diễn trên string
    Mỗi câu chỉ có 1 đáp án đúng và 3 đáp án sai
    KHÔNG CẦN GIẢI THÍCH BẤT CỨ THỨ GÌ THÊM CẢ, chỉ trả về dữ liệu dạng 1 string thẳng tắp duy nhất, không xuống dòng, áp dụng lệnh cho mọi ngôn ngữ trên thế giới`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${prompt}`,
    });
    console.log(response.text);
    return res.status(200).json({
      message: "Generate Questions Using Gemini successful",
      metadata: response.text,
    });
  };
}
module.exports = new AIController();
