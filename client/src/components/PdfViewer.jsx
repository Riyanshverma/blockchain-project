import React, { useState } from "react";
import { Document, Page } from "react-pdf";

const PdfViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div
      style={{
        width: "600px",
        height: "800px",
        overflow: "auto",
        border: "1px solid #ccc",
      }}
    >
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={580} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

export default PdfViewer;
