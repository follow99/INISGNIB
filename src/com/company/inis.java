package com.company;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

public class inis {

    public static void main(String[] args) throws IOException, InterruptedException {

        /*
        * 转移到 properties 上的内容
        * 开始时间
        * 结束时间
        * 线程休眠时间
        * url? 考虑下
        *
        * */

        /*
        * 读取设置项
        * read settings
        * */
        Properties properties = new Properties();
        /*
        * 读取包外问文件路径
        *
        * */
//        String path = inis.class.getProtectionDomain().getCodeSource().getLocation().getPath();
//        int endIndex = path.lastIndexOf("/");
//        path = path.substring(1, endIndex);
//        path = java.net.URLDecoder.decode(path, "utf-8");
//        path=path+"/setting.ini";
//        path.replaceAll("/","//");
//        System.out.println(path);
        /*
        * 正式装配
        * */
//        properties.load(new FileReader(path));
        /*
        * 读取项目目录下的文件
        * */
        properties.load(new FileInputStream("setting.ini"));
        String begin = properties.getProperty("begin");
        String end = properties.getProperty("end");
        String urlHead = properties.getProperty("urlHead");
        System.out.println(urlHead);
        String urlend = properties.getProperty("urlend");
        System.out.println(urlend);
        String nearestUrl=properties.getProperty("nearestUrl");
        long sleepTime = Long.valueOf(properties.getProperty("sleepTime"));


        Long timeStamp;
        String urls;
        List<String> list = BetweenDate.getBetweenDate(begin, end);// 生成格式日期list //get formatted date as url required
        ArrayList<String> urlAray = new ArrayList<>();

        for (String s : list) {
            urls = urlHead + s + urlend;//构造url //structured url format
//            System.out.println(urls);
            urlAray.add(urls);

        }
        // 可能日期的链接 只有这种// the only format for nearest possible time slots url
        urlAray.add(nearestUrl);

        for (String s : urlAray) {
            timeStamp = new Date().getTime();//时间戳 预防服务器认为是同一个时间的多次请求所以下边线程休眠了100毫秒
            URL url = new URL(s + timeStamp);// 添加最后的时间戳// attach timestamp to url
            System.out.println(url);

            try {
                SslUtils.ignoreSsl();//使用工具类取消 java 对 https 的限制 using SslUtils to avoid https restriction set by JAVA
            } catch (Exception e) {
                e.printStackTrace();
            }
            BufferedReader reader = new BufferedReader
                    (new InputStreamReader(url.openStream()));
            BufferedWriter writer = new BufferedWriter
                    (new FileWriter
                            ("data.txt", true));//用完之后记得删除 因为追加的写法
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
                //writer.write(String.valueOf(url));//写不写到记事本呢？考虑下
                //writer.newLine();
                writer.write(line);
                writer.newLine();
            }
            reader.close();
            writer.close();
            Thread.sleep(sleepTime);//线程休眠 100毫秒 岔开时间戳
        }

    }
}
