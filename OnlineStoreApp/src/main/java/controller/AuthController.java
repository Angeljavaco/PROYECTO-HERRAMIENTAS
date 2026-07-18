package controller;

import java.io.IOException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AuthController extends HttpServlet {

 protected void doGet(HttpServletRequest request, HttpServletResponse response)
         throws IOException {
     response.getWriter().write("PROYECTO PRO FUNCIONANDO 🚀");
 }
}
