import java.awt.BorderLayout;
import java.awt.EventQueue;
import java.awt.FlowLayout;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class CalculadoraRestClient extends JFrame {
    private JTextField operador1TextField;
    private JTextField operador2TextField;
    private JComboBox<String> operacaoComboBox;
    private JTextField resultadoTextField;

    private static final String BASE_URL = "https://calculadora-fxpc.onrender.com";

    private final HttpClient client = HttpClient.newHttpClient();

    public CalculadoraRestClient() {
        super("Calculadora REST Client");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel(new BorderLayout());
        add(panel);

        // Painel superior (inputs)
        JPanel inputPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        panel.add(inputPanel, BorderLayout.NORTH);

        inputPanel.add(new JLabel("Operador 1:"));
        operador1TextField = new JTextField(10);
        inputPanel.add(operador1TextField);

        inputPanel.add(new JLabel("Operador 2:"));
        operador2TextField = new JTextField(10);
        inputPanel.add(operador2TextField);

        inputPanel.add(new JLabel("Operação:"));
        operacaoComboBox = new JComboBox<>();
        inputPanel.add(operacaoComboBox);

        JButton calcularButton = new JButton("Calcular");
        calcularButton.addActionListener(e -> calcular());
        inputPanel.add(calcularButton);

        // Painel inferior (resultado)
        JPanel outputPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        panel.add(outputPanel, BorderLayout.SOUTH);

        outputPanel.add(new JLabel("Resultado da Operação:"));
        resultadoTextField = new JTextField(10);
        resultadoTextField.setEditable(false);
        outputPanel.add(resultadoTextField);

        // Carregar operações da API
        carregarOperacoes();

        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    // ================== GET /operations ==================
    private void carregarOperacoes() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL + "/operations"))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            String body = response.body();

            // Pegamos o array interno: [ {operation}, {operation} ]
            int start = body.indexOf("[");
            int end = body.lastIndexOf("]");

            if (start == -1 || end == -1) {
                JOptionPane.showMessageDialog(this,
                        "Resposta de operações inválida:\n" + body,
                        "Erro", JOptionPane.ERROR_MESSAGE);
                return;
            }

            String array = body.substring(start + 1, end).trim();

            // Divide cada objeto {...}
            String[] objetos = array.split("\\},\\s*\\{");

            for (String obj : objetos) {
                obj = obj.replace("{", "").replace("}", "").trim();

                // Pega o campo "name"
                int idx = obj.indexOf("\"name\":");
                if (idx == -1) continue;

                String resto = obj.substring(idx + 7).trim(); // pula "name":
                resto = resto.replace("\"", "").trim();

                String name = resto.split(",")[0].trim();

                operacaoComboBox.addItem(name);
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(this,
                    "Erro ao carregar operações: " + e.getMessage(),
                    "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }

    // ================== POST /operation/{op}/{a}/{b} ==================
    private void calcular() {
        String operador1 = operador1TextField.getText();
        String operador2 = operador2TextField.getText();

        String operacaoSelecionada = (String) operacaoComboBox.getSelectedItem();
        if (operacaoSelecionada == null) {
            resultadoTextField.setText("Nenhuma operação carregada.");
            return;
        }

        // Converter nome exibido para path da API
        String operacaoApi = switch (operacaoSelecionada.toLowerCase()) {
            case "soma" -> "soma";
            case "subtracao" -> "subtracao";
            case "multiplicacao" -> "multiplicacao";
            case "divisao" -> "divisao";
            default -> "soma";
        };

        String url = BASE_URL + "/operation/" + operacaoApi + "/" + operador1 + "/" + operador2;

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            String body = response.body();

            // API retorna: { "result": 15.0 }
            String valor = "Erro";

            int idx = body.indexOf("\"result\":");
            if (idx != -1) {
                int start = idx + 9;
                String resto = body.substring(start);
                resto = resto.replaceAll("[^0-9.\\-]", ""); // deixa só números
                valor = resto;
            }

            resultadoTextField.setText(valor);

        } catch (IOException | InterruptedException e) {
            resultadoTextField.setText("Erro: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        EventQueue.invokeLater(CalculadoraRestClient::new);
    }
}