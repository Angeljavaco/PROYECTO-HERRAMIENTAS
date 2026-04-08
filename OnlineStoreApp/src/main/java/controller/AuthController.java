package controller;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;

public class AuthController extends HttpServlet {

 protected void doGet(HttpServletRequest request, HttpServletResponse response)
         throws IOException {
     response.getWriter().write("PROYECTO PRO FUNCIONANDO 🚀");
 }
}
