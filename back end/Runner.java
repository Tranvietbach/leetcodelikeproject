import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Parameter;
import java.util.Arrays;

// javac runner.java script.java
public class Runner {
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: java Runner ClassName.methodName [args...]");
            return;
        }

        String[] parts = args[0].split("\\.");
        if (parts.length != 2) {
            System.out.println("Invalid method format. Use ClassName.methodName");
            return;
        }

        String className = parts[0];
        String methodName = parts[1];
        String[] rawArgs = Arrays.copyOfRange(args, 1, args.length);

        try {
            Class<?> clazz = Class.forName(className);
            Method[] methods = clazz.getDeclaredMethods();

            for (Method method : methods) {
                if (!method.getName().equals(methodName))
                    continue;

                Parameter[] params = method.getParameters();
                if (params.length != rawArgs.length)
                    continue;

                Object[] parsedArgs = new Object[params.length];
                boolean valid = true;

                for (int i = 0; i < params.length; i++) {
                    try {
                        parsedArgs[i] = parseArg(params[i].getType(), rawArgs[i]);
                    } catch (Exception e) {
                        valid = false;
                        break;
                    }
                }

                if (!valid)
                    continue;

                method.setAccessible(true); // Bypass access check if needed

                Object instance = null;
                if (!Modifier.isStatic(method.getModifiers())) {
                    instance = clazz.getDeclaredConstructor().newInstance(); // Tạo object nếu không phải static
                }

                Object result = method.invoke(instance, parsedArgs); // static thì instance=null
                // chạy hàm bên tron tệp scrip.java mà thí sinh gửi lên

                if (result instanceof int[]) {
                    System.out.println(Arrays.toString((int[]) result));
                } else if (result instanceof String[]) {
                    System.out.println(Arrays.toString((String[]) result));
                } else {
                    System.out.println(result);
                }

                return;
            }

            System.out.println("No matching method found or argument mismatch.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static Object parseArg(Class<?> type, String arg) {
        arg = arg.trim();

        if (type == int.class || type == Integer.class) {
            return Integer.parseInt(arg);
        }

        if (type == String.class) {
            return arg.replaceAll("^['\"]|['\"]$", ""); // remove outer quotes
        }

        if (type == int[].class) {
            arg = arg.replaceAll("[\\[\\]\\s]", "");
            String[] parts = arg.split(",");
            return Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();
        }

        if (type == String[].class) {
            arg = arg.replaceAll("[\\[\\]\\s]", "");
            String[] parts = arg.split(",");
            return Arrays.stream(parts)
                    .map(s -> s.replaceAll("^['\"]|['\"]$", ""))
                    .toArray(String[]::new);
        }

        if (type == int[][].class) {
            arg = arg.replaceAll("\\s", "");
            arg = arg.substring(1, arg.length() - 1);
            String[] rows = arg.split("\\],\\[");
            int[][] result = new int[rows.length][];
            for (int i = 0; i < rows.length; i++) {
                String row = rows[i].replaceAll("\\[|\\]", "");
                String[] nums = row.split(",");
                int[] rowArray = Arrays.stream(nums)
                        .mapToInt(Integer::parseInt)
                        .toArray();
                result[i] = rowArray;
            }
            return result;
        }
        throw new IllegalArgumentException("Unsupported type: " + type.getName());
    }
}
