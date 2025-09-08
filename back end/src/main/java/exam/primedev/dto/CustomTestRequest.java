package exam.primedev.dto;

import java.util.List;

public class CustomTestRequest {
    private Long problemId;
    private int programmingLanguageId;
    private String code;
    private String slug;
    private List<InputValue> inputValues;

    // Getters và Setters
    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public int getProgrammingLanguageId() {
        return programmingLanguageId;
    }

    public void setProgrammingLanguageId(int programmingLanguageId) {
        this.programmingLanguageId = programmingLanguageId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
    public String getSlug() {
        return slug;
    }
    public void setSlug(String slug) {
        this.slug = slug;
    }

    public List<InputValue> getInputValues() {
        return inputValues;
    }

    public void setInputValues(List<InputValue> inputValues) {
        this.inputValues = inputValues;
    }

    // Inner class InputValue
    public static class InputValue {
        private String name;
        private String value;
        private int type; // 1: str, 2: int, 3: arrint, 4: arrstr

        public InputValue() {}

        public InputValue(String name, String value, int type) {
            this.name = name;
            this.value = value;
            this.type = type;
        }

        // Getters và Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public int getType() {
            return type;
        }

        public void setType(int type) {
            this.type = type;
        }
    }
}
