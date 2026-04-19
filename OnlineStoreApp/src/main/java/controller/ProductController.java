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

        String json = "[" +
        "{\"id\":1,\"name\":\"Laptop Gamer\",\"price\":3500,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/21853812-1000-1000/2938864.jpg?v=638907148455170000\"}," +
        "{\"id\":2,\"name\":\"Mouse Inalámbrico\",\"price\":80,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/18863606-1000-1000/imageUrl_1.jpg?v=638639596844600000\"}," +
        "{\"id\":3,\"name\":\"Teclado Mecánico\",\"price\":250,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/24461600-1000-1000/imageUrl_1.jpg?v=639072506055830000\"}," +
        "{\"id\":4,\"name\":\"Monitor 24 pulgadas\",\"price\":900,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/23773613-1000-1000/imageUrl_1.jpg?v=639036217581930000\"}," +
        "{\"id\":5,\"name\":\"Audífonos Bluetooth\",\"price\":180,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/20196534-1000-1000/2406067jpg.jpg?v=638699726207630000\"}," +
        "{\"id\":6,\"name\":\"Silla Gamer\",\"price\":700,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/16413338-1000-1000/SLS990101--1-.jpg?v=638321410430400000\"}," +
        "{\"id\":7,\"name\":\"Webcam HD\",\"price\":150,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/24884064-1000-1000/imageUrl_1.jpg?v=639117435531500000\"}," +
        "{\"id\":8,\"name\":\"Disco SSD 1TB\",\"price\":400,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/24421858-1000-1000/image-0.jpg?v=639070480478900000\"}," +
        "{\"id\":9,\"name\":\"Memoria RAM 16GB\",\"price\":320,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/24516963-1000-1000/imageUrl_1.jpg?v=639077869501930000\"}," +
        "{\"id\":10,\"name\":\"Laptop Ultrabook\",\"price\":2800,\"image\":\"https://hiraoka.com.pe/media/catalog/product/d/2/d2kb2la_02imagenprincipalsintexto.jpg?quality=85&bg-color=255,255,255&fit=bounds&height=560&width=700&canvas=700:560\"}," +
        "{\"id\":11,\"name\":\"Tablet Android\",\"price\":600,\"image\":\"https://oechsle.vteximg.com.br/arquivos/ids/21976484-1000-1000/2948373.jpg?v=638924194016200000\"}," +
        "{\"id\":12,\"name\":\"Smartwatch\",\"price\":250,\"image\":\"https://promart.vteximg.com.br/arquivos/ids/6536981-1000-1000/image-e1b6a9877a3b42efb43d90e8350db593.jpg?v=637993969074200000\"}" +
        "]";

        response.getWriter().write(json);
    }
}