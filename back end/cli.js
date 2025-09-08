const funcs = require('./script');
const [,, funcName, ...args] = process.argv;

if (funcName in funcs) {
    const fn = funcs[funcName];

    const parsedArgs = args.map(arg => {
        // Nếu là mảng nhưng dùng dấu nháy đơn thì chuyển sang nháy kép
        let fixedArg = arg.trim();
        if (fixedArg.startsWith("['") && fixedArg.endsWith("']")) {
            fixedArg = fixedArg.replace(/'/g, '"');
        }

        try {
            const parsed = JSON.parse(fixedArg);

            // Nếu là mảng số dạng chuỗi thì chuyển thành số
            if (Array.isArray(parsed) && parsed.every(x => !isNaN(x))) {
                return parsed.map(Number);
            }

            return parsed;
        } catch (e) {
            // Không parse được thì trả lại string gốc
            return arg;
        }
    });

    try {
        const result = fn(...parsedArgs);
        console.log(result);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
} else {
    console.error(`Function "${funcName}" not found`);
    process.exit(1);
}
