import React, { useState } from "react";
import { jsPDF } from "jspdf";

function App() {
  const [selecionados, setSelecionados] = useState([]);

  const itens = ["Açaí", "Banana", "Manga", "Leite", "Aveia"]; // Corrigido "Aveai" para "Aveia"

  const handleItemClick = (item) => {
    if (!selecionados.includes(item)) {
      setSelecionados([...selecionados, item]);
    }
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Relatório de Itens Selecionados", 20, 20);
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

  const imprimir = () => {
    alert("A funcionalidade de impressão via Bluetooth está em desenvolvimento.");
    // Adicione a lógica de impressão Bluetooth aqui no futuro
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
              backgroundColor: "#f9f9f9",
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
        onClick={imprimir}
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
        Imprimir
      </button>
    </div>
  );
}

export default App;
