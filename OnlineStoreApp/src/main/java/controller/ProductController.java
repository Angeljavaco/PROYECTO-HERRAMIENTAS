package controller;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;

public class ProductController extends HttpServlet {

 protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException {

    response.setContentType("application/json");

    // 🔥 SOLUCIÓN CORS
    response.setHeader("Access-Control-Allow-Origin", "*");

    String json = "[{\"id\":1,\"name\":\"Laptop\",\"price\":2500}," +
                  "{\"id\":2,\"name\":\"Mouse\",\"price\":80}]";

    response.getWriter().write(json);
}
} 