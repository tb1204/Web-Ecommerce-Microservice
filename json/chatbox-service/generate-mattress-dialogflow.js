const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const targetDir = 'd:\\luanvanhk2dvb\\json\\chatbox-service\\dialogflow-mattress-export';
const entitiesDir = path.join(targetDir, 'entities');
const intentsDir = path.join(targetDir, 'intents');

const randomId = () => crypto.randomUUID();

// Clean up existing files
[entitiesDir, intentsDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (file.endsWith('.json')) fs.unlinkSync(path.join(dir, file));
    });
  } else {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// --- GENERATE ENTITIES ---
const createEntity = (name, entries) => {
  const entityId = randomId();
  // The main entity config
  const configData = {
    id: entityId,
    name: name,
    isOverridable: true,
    isEnum: false,
    isRegexp: false,
    automatedExpansion: true,
    allowFuzzyExtraction: true
  };
  fs.writeFileSync(path.join(entitiesDir, `${name}.json`), JSON.stringify(configData, null, 2));

  // The entries data (in Vietnamese)
  const entriesData = entries.map(e => ({ value: e[0], synonyms: e }));
  fs.writeFileSync(path.join(entitiesDir, `${name}_entries_vi.json`), JSON.stringify(entriesData, null, 2));
};

createEntity('product_type', [
  ['Nệm', 'nệm', 'đệm', 'nem', 'dem'],
  ['Chăn ga', 'chăn ga', 'drap', 'ra giường', 'bộ drap'],
  ['Gối', 'gối', 'goi', 'gối ngủ', 'gối ôm'],
  ['Phụ kiện', 'phụ kiện', 'topper', 'tấm bảo vệ nệm'],
  ['Topper', 'topper nệm', 'tấm lót', 'lót nệm']
]);

createEntity('brand', [
  ['Kymdan', 'Kim đan', 'kim đan', 'kym đan'],
  ['Liên Á', 'liên á', 'liên a', 'lien a'],
  ['Vạn Thành', 'vạn thành', 'van thanh'],
  ['Kim Cương', 'kim cương', 'kim cuong'],
  ['Gummi', 'gummi', 'gumi', 'gum mi'],
  ['Wonjun', 'wonjun', 'won jun', 'quân chun'],
  ['Goodnight', 'goodnight', 'good night'],
  ['Aeroflow', 'aeroflow', 'aero flow']
]);

createEntity('mattress_type', [
  ['Nệm cao su', 'nệm mủ cao su', 'đệm cao su', 'nệm cao su thiên nhiên'],
  ['Nệm lò xo', 'đệm lò xo', 'lò xo túi'],
  ['Nệm bông ép', 'đệm bông ép', 'nệm gấp', 'nệm xếp'],
  ['Nệm Foam', 'đệm foam', 'nệm mút', 'nệm memory foam']
]);

createEntity('size', [
  ['120x200', '1m2', '1 mét 2', '120x200cm'],
  ['140x200', '1m4', '1 mét 4', '140x200cm'],
  ['160x200', '1m6', '1 mét 6', '160x200cm'],
  ['180x200', '1m8', '1 mét 8', '180x200cm'],
  ['200x200', '2m', '2 mét', '200x200cm', '2x2'],
  ['220x200', '2m2', '2 mét 2', '220x200cm']
]);

createEntity('firmness', [
  ['Mềm', 'mềm', 'êm', 'êm ái', 'nệm mềm'],
  ['Trung bình', 'trung bình', 'vừa phải', 'không quá cứng'],
  ['Cứng', 'cứng', 'nệm cứng', 'chắc chắn', 'nâng đỡ tốt']
]);

createEntity('color', [
  ['Trắng', 'trắng', 'trắng tinh', 'trắng sữa'],
  ['Xanh', 'xanh', 'xanh dương', 'xanh lá'],
  ['Xám', 'xám', 'màu ghi', 'màu xám'],
  ['Hồng', 'hồng', 'màu hồng']
]);

createEntity('material', [
  ['Cao su thiên nhiên', 'cao su tự nhiên', 'mủ cao su'],
  ['Cao su nhân tạo', 'cao su tổng hợp', 'cao su non'],
  ['Lò xo túi độc lập', 'lò xo túi', 'lò xo độc lập'],
  ['Bông ép', 'sợi bông', 'bông polyester'],
  ['Foam', 'mút xốp', 'memory foam']
]);

createEntity('price_range', [
  ['Dưới 5 triệu', 'dưới 5tr', 'rẻ', 'mức giá rẻ', 'giá sinh viên'],
  ['5 đến 10 triệu', 'từ 5 đến 10tr', 'tầm trung', 'vừa tiền'],
  ['Trên 10 triệu', 'trên 10tr', 'cao cấp', 'hàng xịn', 'đắt tiền']
]);

createEntity('sleep_purpose', [
  ['Đau lưng', 'đau cột sống', 'đau nhức xương khớp', 'nệm cho người đau lưng'],
  ['Vai gáy', 'bị đau vai', 'nhức mỏi cổ', 'gối cho vai gáy'],
  ['Mát mẻ', 'nằm mát', 'nệm mát mẻ', 'nệm mùa hè', 'nệm thoáng khí'],
  ['Trẻ em', 'em bé', 'trẻ sơ sinh', 'nệm cho bé'],
  ['Bà bầu', 'mang thai', 'nệm cho bà bầu']
]);

createEntity('promotion_type', [
  ['Khuyến mãi', 'giảm giá', 'sale', 'voucher'],
  ['Quà tặng', 'tặng kèm', 'combo', 'quà tặng']
]);

createEntity('order_id', [
  ['Mã đơn hàng', 'mã đơn', 'số đơn', 'số hoá đơn']
]);

const createIntent = (name, userSaysArray, responseText, action = "") => {
  const intentId = randomId();
  
  // Create defined parameters
  let parameters = [];
  userSaysArray.forEach(says => {
     says.forEach(part => {
        if (typeof part !== 'string' && part.alias) {
            // keep it simple, just add if not exists
            if (!parameters.find(p => p.name === part.alias)) {
                parameters.push({
                  id: randomId(),
                  name: part.alias,
                  required: false,
                  dataType: "@" + part.alias,
                  value: "$" + part.alias,
                  defaultValue: "",
                  isList: false,
                  prompts: [],
                  promptMessages: [],
                  noMatchPromptMessages: [],
                  noInputPromptMessages: [],
                  outputDialogContexts: []
                });
            }
        }
     });
  });

  // Main intent file
  const configData = {
    id: intentId,
    name: name,
    auto: true,
    contexts: [],
    responses: [
      {
        resetContexts: false,
        action: action,
        affectedContexts: [],
        parameters: parameters,
        messages: [
          {
            type: "0",
            title: "",
            textToSpeech: "",
            lang: "vi",
            speech: [responseText],
            condition: ""
          }
        ],
        speech: []
      }
    ],
    priority: 500000,
    webhookUsed: action !== "",
    webhookForSlotFilling: false,
    fallbackIntent: false,
    events: [],
    conditionalResponses: [],
    condition: "",
    conditionalFollowupEvents: []
  };
  fs.writeFileSync(path.join(intentsDir, `${name}.json`), JSON.stringify(configData, null, 2));

  // Training phrases file
  const userSaysData = userSaysArray.map(says => ({
    id: randomId(),
    data: says.map(part => {
      if (typeof part === 'string') {
          return { text: part, userDefined: false };
      }
      return {
        text: part.text,
        alias: part.alias,
        meta: "@" + part.alias,
        userDefined: true
      };
    }),
    isTemplate: false,
    count: 0,
    lang: "vi",
    updated: 0
  }));
  fs.writeFileSync(path.join(intentsDir, `${name}_usersays_vi.json`), JSON.stringify(userSaysData, null, 2));
};

// --- GENERATE INTENTS ---
createIntent('welcome', [
  ['Chào shop'], ['Hello'], ['Xin chào'], ['Hi b']
], 'Xin chào! Tôi là Trợ lý AI của Cửa hàng Nệm & Chăn Ga. Tôi có thể giúp bạn tìm hiểu chi tiết sản phẩm, tư vấn chọn nệm theo tình trạng sức khỏe, hoặc giải quyết vấn đề về đơn hàng nhé!');

createIntent('fallback', [
  ['hfiwhifwhfiwhfih']
], 'Xin lỗi, tôi chưa hiểu rõ ý của bạn. Bạn có thể nói rõ hơn về việc muốn tìm nệm, chăn ga, hay kiểm tra đơn hàng không ạ?');

createIntent('search_product', [
  ['Tìm cho tôi ', {text: 'nệm', alias: 'product_type'}],
  ['Shop có bán ', {text: 'chăn ga', alias: 'product_type'}, ' không'],
  ['Xem danh sách ', {text: 'nệm', alias: 'product_type'}, ' hãng ', {text: 'Liên Á', alias: 'brand'}]
], 'Đây là các sản phẩm bạn đang tìm kiếm:', 'search_product');

createIntent('product_detail', [
  ['Cho mình xem chi tiết ', {text: 'nệm lò xo', alias: 'mattress_type'}, ' của ', {text: 'Kim Cương', alias: 'brand'}],
  ['Nệm này có kích thước ', {text: '180x200', alias: 'size'}, ' không?'],
  ['Sản phẩm này giá bao nhiêu?']
], 'Dưới đây là thông tin chi tiết:', 'product_detail');

createIntent('consult_mattress', [
  ['Tôi bị ', {text: 'Đau lưng', alias: 'sleep_purpose'}, ' thì nằm nệm nào tốt?'],
  ['Bà xã tôi đang ', {text: 'Bà bầu', alias: 'sleep_purpose'}, ' nên mua nệm nào?'],
  ['Tư vấn ', {text: 'Mát mẻ', alias: 'sleep_purpose'}, ' loại ', {text: 'Cao cấp', alias: 'price_range'}, ' đi shop'],
  ['Người già hay ', {text: 'Đau lưng', alias: 'sleep_purpose'}, ' cần ', {text: 'Cứng', alias: 'firmness'}]
], 'Thế thì bạn nên dùng các loại nệm sau đây cho tốt sức khỏe:');

createIntent('compare_product', [
  ['So sánh ', {text: 'Nệm cao su', alias: 'mattress_type'}, ' và ', {text: 'Nệm lò xo', alias: 'mattress_type'}],
  ['Nệm hãng ', {text: 'Kymdan', alias: 'brand'}, ' khác gì ', {text: 'Liên Á', alias: 'brand'}],
  ['Nên mua nệm nào ', {text: 'Dưới 5 triệu', alias: 'price_range'}]
], 'Chào bạn, sự khác biệt chính giữa các dòng sản phẩm này là cấu tạo và giá cả. Bảng so sánh cụ thể:');

createIntent('add_to_cart', [
  ['Mình muốn mua nệm này'],
  ['Thêm vào giỏ hàng giúp mình'],
  ['Đặt mua ', {text: 'Nệm bông ép', alias: 'mattress_type'}]
], 'Vui lòng nhấn vô nút Thêm Vào Giỏ Hàng nghen bạn!');

createIntent('check_promotion', [
  ['Có chương trình ', {text: 'Khuyến mãi', alias: 'promotion_type'}, ' nào không?'],
  ['Nệm ', {text: 'Vạn Thành', alias: 'brand'}, ' có đang ', {text: 'Giảm giá', alias: 'promotion_type'}, ' không?']
], 'Hiện tại cửa hàng đang có các mã Voucher siêu hot. Bạn lên app xem nhé!');

createIntent('check_order', [
  ['Kiểm tra mã đơn ', {text: 'Mã đơn hàng', alias: 'order_id'}, ' đang ở đâu rồi'],
  ['Đơn hàng của mình chừng nào giao?'],
  ['Tra cứu đơn']
], 'Đang tra cứu từ Cơ sở dữ liệu...', 'check_order');

createIntent('payment_info', [
  ['Shop có những hình thức thanh toán nào?'],
  ['Trả góp được không?'],
  ['Chấp nhận thẻ tín dụng không?']
], 'Chúng tôi hỗ trợ COD (Thanh toán khi nhận hàng) và Payment qua Ví điện tử/Thẻ tín dụng VNPAY cực kỳ an toàn nha!');

createIntent('delivery_info', [
  ['Phí ship nệm bao nhiêu?'],
  ['Giao nệm tỉnh mất bao lâu?'],
  ['Nhà ở chung cư có khiêng nệm lên tận phòng không?']
], 'Chúng tôi có chính sách giao nệm tận phòng phí thấp (thậm chí Freeship) tại nhiều khu vực.');

createIntent('cancel_or_return', [
  ['Mình muốn đổi trả nệm'],
  ['Nệm bảo hành lún xẹp bao lâu?'],
  ['Huỷ đơn hàng này giúp mình']
], 'Chính sách đổi trả lên đến 100 ngày nếu lún xẹp. Lưu ý nệm không thể trả nếu bạn không muốn ngủ nữa.');

console.log("Done generating all dialogflow contents with split files!");
