package exam.primedev.utils;

import oshi.SystemInfo;
import oshi.software.os.OSProcess;
import oshi.software.os.OperatingSystem;

public class MemoryUtil {

    public static float getMemoryUsageMB(long pid) {
        SystemInfo si = new SystemInfo();
        OperatingSystem os = si.getOperatingSystem();
        OSProcess process = os.getProcess((int) pid);

        if (process != null) {
            long memoryBytes = process.getResidentSetSize(); // bytes
            return memoryBytes / 1024f / 1024f;
        } else {
            System.out.println("Process not found");
            return -1;
        }
    }
}

