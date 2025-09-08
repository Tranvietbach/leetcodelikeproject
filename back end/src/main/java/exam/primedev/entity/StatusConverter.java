package exam.primedev.entity;

import jakarta.persistence.*;


@Converter(autoApply = false)
public class StatusConverter implements AttributeConverter<Submission.Status, String> {

    @Override
    public String convertToDatabaseColumn(Submission.Status status) {
        return status == null ? null : status.name(); // save as uppercase
    }

    @Override
    public Submission.Status convertToEntityAttribute(String dbValue) {
        return dbValue == null ? null : Submission.Status.valueOf(dbValue.toUpperCase());
    }
}
