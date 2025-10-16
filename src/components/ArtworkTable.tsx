import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";


interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<number>(0);

  const overlayRef = useRef<OverlayPanel>(null);

  const fetchArtworks = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageNum}`
      );
      const data = await res.json();
      setArtworks(data.data);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  const handleSelectSubmit = () => {
    if (inputValue > 0 && artworks.length > 0) {
      const selected = artworks.slice(0, inputValue);
      setSelectedArtworks(selected);
    } else {
      setSelectedArtworks([]);
    }
    setInputValue(0);
    overlayRef.current?.hide();
  };

  const headerDropdownTemplate = (event: React.SyntheticEvent) => {
    overlayRef.current?.toggle(event);
  };

  return (
    <div className="table-container" style={{ padding: "1rem" }}>
      <h2 className="table-title">Artworks Data</h2>

      <DataTable
        value={artworks}
        dataKey="id"
        loading={loading}
        responsiveLayout="scroll"
        showGridlines
        stripedRows
        className="custom-table"
        selectionMode="checkbox" 
        selection={selectedArtworks}
        onSelectionChange={(e) => setSelectedArtworks(e.value)}
      >
        <Column
          selectionMode="multiple"
          header={
            <Dropdown
              value={null}
              options={[{ label: "", value: "open" }]}
              placeholder="Select"
              style={{ width: "130px" }}
              onClick={headerDropdownTemplate} 
            />
          }
          style={{ width: "6rem" }}
        />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      <OverlayPanel
        ref={overlayRef}
        showCloseIcon
        dismissable
        style={{
          padding: "1.2rem",
          width: "280px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          background: "#ffffffff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="number"
            min={1}
            max={artworks.length}
            placeholder="Enter number of rows"
            value={inputValue || ""}
            onChange={(e) => setInputValue(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "0.6rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <Button
            label="Select Rows"
            className="p-button-rounded p-button-success"
            style={{
              width: "100%",
              padding: "0.6rem",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            onClick={handleSelectSubmit}
          />
        </div>
      </OverlayPanel>

      <div className="pagination" style={{ marginTop: "1rem" }}>
        <Button
          label="Previous Page"
          className="p-button-sm p-button-text"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        />
        <span style={{ margin: "0 1rem" }}>Page {page}</span>
        <Button
          label="Next Page"
          className="p-button-sm p-button-text"
          onClick={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  );
};

export default ArtworkTable;
