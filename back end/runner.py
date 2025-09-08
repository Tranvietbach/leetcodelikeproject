# import sys
# import importlib
# import ast

# def smart_parse(arg):
#     try:
#         return ast.literal_eval(arg)
#     except:
#         return arg

# if len(sys.argv) < 2:
#     print("Usage: func_name [args...]")
#     sys.exit(1)
# # Lấy tên hàm và các đối số từ dòng lệnh

# func_name = sys.argv[1]
# args = [smart_parse(arg) for arg in sys.argv[2:]]

# # Import sẵn module script
# # Lây hàm bên trong script và gán vào biến func
# import script
# func = getattr(script, func_name)

# result = func(*args) # thực thi bên trong script và lấy kết quả
# print(result)

import sys
import importlib
import ast
import script

# Parse an argument smartly using literal_eval
def smart_parse(arg):
    try:
        return ast.literal_eval(arg)
    except:
        return arg

if len(sys.argv) < 2:
    print("Usage: func_name [args...]")
    sys.exit(1)

# Lấy tên hàm và các đối số từ dòng lệnh
func_name = sys.argv[1]
args = [smart_parse(arg) for arg in sys.argv[2:]]

# Gọi hàm từ class nếu có
if hasattr(script, "scrip"):
    instance = script.scrip()
    func = getattr(instance, func_name)
else:
    func = getattr(script, func_name)

# In kết quả
result = func(*args)
print(result)