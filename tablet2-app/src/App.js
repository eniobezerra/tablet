import React, { useState } from "react";
import { jsPDF } from "jspdf";

const conectarEImprimir = async (selecionados) => {
  try {
    // Verifica se há itens selecionados antes de tentar imprimir
    if (selecionados.length === 0) {
      alert("Nenhum item selecionado para impressão.");
      return;
    }

    // Solicita ao usuário a conexão com a impressora Bluetooth
    const dispositivo = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"], // Substitua pelo UUID do serviço da KP-1025
    });

    const servidor = await dispositivo.gatt.connect();
    const servico = await servidor.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb"); // UUID do serviço
    const caracteristica = await servico.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb"); // UUID da característica

    // Cria o texto a ser enviado para a impressão
    const texto = `Relatório de Itens Selecionados\n\n${selecionados.join("\n")}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);

    // Envia os dados para a impressora
    await caracteristica.writeValue(data);
    alert("Impressão realizada com sucesso!");
  } catch (error) {
    console.error("Erro ao imprimir:", error);
    alert("Erro ao imprimir. Verifique a conexão com a impressora.");
  }
};

function App() {
  const [selecionados, setSelecionados] = useState([]);

  const itens = ["Açaí", "Banana", "Manga", "Leite", "Aveia"];

  const handleItemClick = (item) => {
    if (selecionados.includes(item)) {
      setSelecionados(selecionados.filter((i) => i !== item));
    } else {
      setSelecionados([...selecionados, item]);
    }
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Pedido nmero 01", 20, 20);
    doc.setFontSize(12);

    if (selecionados.length === 0) {
      doc.text("Nenhum item selecionado.", 20, 40);
    } else {
      selecionados.forEach((item, index) => {
        doc.text(`${index + 1}. ${item}`, 20, 40 + index * 10);
      });
    }

    doc.save("relatorio.pdf");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Escolha os itens</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {itens.map((item) => (
          <li
            key={item}
            style={{
              margin: "10px 0",
              cursor: "pointer",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: selecionados.includes(item) ? "#d0f0c0" : "#f9f9f9",
            }}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
      <h2>Relatório</h2>
      {selecionados.length > 0 ? (
        <ul>
          {selecionados.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum item selecionado.</p>
      )}
      <button
        onClick={gerarPDF}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Gerar PDF
      </button>
      <button
        onClick={() => conectarEImprimir(selecionados)}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Imprimir via Bluetooth
      </button>
    </div>
  );
}

export default App;
