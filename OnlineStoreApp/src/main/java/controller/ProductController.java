package controller;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;

public class ProductController extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        // CORS
        response.setHeader("Access-Control-Allow-Origin", "*");

        String json = "["
                + "{\"id\":1,\"name\":\"Laptop Gamer\",\"price\":3500,\"image\":\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8\"},"
                + "{\"id\":2,\"name\":\"Mouse Inalámbrico\",\"price\":80,\"image\":\"https://images.unsplash.com/photo-1587829741301-dc798b83add3\"},"
                + "{\"id\":3,\"name\":\"Teclado Mecánico\",\"price\":250,\"image\":\"https://images.unsplash.com/photo-1518779578993-ec3579fee39f\"},"
                + "{\"id\":4,\"name\":\"Monitor 24 pulgadas\",\"price\":900,\"image\":\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf\"},"
                + "{\"id\":5,\"name\":\"Audífonos Bluetooth\",\"price\":180,\"image\":\"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400\"},"                + "{\"id\":6,\"name\":\"Silla Gamer\",\"price\":700,\"image\":\"https://images.unsplash.com/photo-1587202372775-e229f172b9d7\"},"
                + "{\"id\":7,\"name\":\"Webcam HD\",\"price\":150,\"image\":\"https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04\"},"
                + "{\"id\":8,\"name\":\"Disco SSD 1TB\",\"price\":400,\"image\":\"https://images.unsplash.com/photo-1587202372634-32705e3bf49c\"},"
                + "{\"id\":9,\"name\":\"Memoria RAM 16GB\",\"price\":320,\"image\":\"https://images.unsplash.com/photo-1563206767-5b18f218e8de\"},"
                + "{\"id\":10,\"name\":\"Laptop Ultrabook\",\"price\":2800,\"image\":\"https://images.unsplash.com/photo-1496181133206-80ce9b88a853\"},"
                + "{\"id\":11,\"name\":\"Tablet Android\",\"price\":600,\"image\":\"https://images.unsplash.com/photo-1587829741301-dc798b83add3\"},"
                + "{\"id\":12,\"name\":\"Smartwatch\",\"price\":250,\"image\":\"https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b\"}"
                + "]";

        response.getWriter().write(json);
    }
}