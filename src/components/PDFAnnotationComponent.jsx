import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Typography, Box, Slider, Select, MenuItem } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { PDFDocument, rgb } from 'pdf-lib';
// import { GlobalWorkerOptions } from 'pdfjs-dist';

// GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${GlobalWorkerOptions.version}/pdf.worker.min.js`;
// GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

 
const PDFAnnotationComponent = ({ pdfData, onSave }) => {
  useEffect(() => {
    // pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    // console.log(GlobalWorkerOptions.workerSrc);
    // if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    //   pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js';
    // }
  }, []);
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [mode, setMode] = useState('view'); // 'draw' or 'erase' or 'view'
  const [canvasRefs, setCanvasRefs] = useState([]);
  const [drawnPaths, setDrawnPaths] = useState(new Array()); // Array of paths for each page
  const [lineWidth, setLineWidth] = useState(2); // Default line width
  const [lineColor, setLineColor] = useState('black'); // Default color
  const pageDimensions = useRef([]);
  const [zoom, setZoom] = useState(1.0);
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 3.0)); // Limit zoom in to 3x
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5)); // Limit zoom out to 0.5x
  };
  useEffect(() => {
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  }, [pdfData]);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCanvasRefs(new Array(numPages).fill().map(() => React.createRef()));
    setDrawnPaths(new Array(numPages).fill([])); // Initialize an empty array for each page
  };

  const handlePageLoadSuccess = (index, { originalWidth, originalHeight }) => {
    pageDimensions.current[index] = { width: originalWidth, height: originalHeight };
  };

  const scaleCoordinates = (clientX, clientY, pageIndex) => {
    const canvas = canvasRefs[pageIndex]?.current;
    if (!canvas || !pageDimensions.current[pageIndex]) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = pageDimensions.current[pageIndex].width / rect.width;
    const scaleY = pageDimensions.current[pageIndex].height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleMouseMove = (e, pageIndex) => {
    if (mode === 'erase') {
      handleErase(e, pageIndex); // Call the handleErase function to update the erase path
    }
  };
  
  // Touch move for erase on mobile
  const handleTouchMove = (e, pageIndex) => {
    if (mode === 'erase') {
      handleErase(e, pageIndex); // Call the handleErase function to update the erase path
    }
  };
  
  const handleMouseDown = (e, pageIndex) => {
    e.preventDefault(); 
    const canvas = canvasRefs[pageIndex]?.current;
    const context = canvas?.getContext('2d');
    if (context && mode !== 'view') {
      const path = { points: [], color: lineColor, width: lineWidth }; // Store color and width with the path
      const { x, y } = scaleCoordinates(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, pageIndex);
      context.beginPath();
      context.moveTo(x, y);
      path.points.push({ x, y });
  
      const draw = (moveEvent) => {
        const { x: moveX, y: moveY } = scaleCoordinates(moveEvent.clientX || moveEvent.touches[0].clientX, moveEvent.clientY || moveEvent.touches[0].clientY, pageIndex);
        context.lineTo(moveX, moveY);
        context.strokeStyle = lineColor; // Use selected color
        context.lineWidth = lineWidth; // Use selected line width
        context.stroke();
        if (mode === 'draw') path.points.push({ x: moveX, y: moveY });
      };
  
      const stopDrawing = () => {
        if (mode === 'draw') {
          const updatedPaths = [...drawnPaths];
          updatedPaths[pageIndex] = [...updatedPaths[pageIndex], path]; // Store paths with their properties separately
          setDrawnPaths(updatedPaths);
        }
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
      };
  
      // Add event listeners for both mouse and touch events
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('touchmove', draw);
      canvas.addEventListener('touchend', stopDrawing, { once: true });
    }
  };
  
  const redrawAnnotations = (index) => {
    const canvas = canvasRefs[index]?.current;
    const context = canvas?.getContext('2d');
    if (context && drawnPaths[index]) {
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
  
      drawnPaths[index].forEach((path) => {
        context.beginPath();
        context.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach((point) => {
          context.lineTo(point.x, point.y);
        });
        context.strokeStyle = path.color; // Use the stored color for the path
        context.lineWidth = path.width; // Use the stored width for the path
        context.stroke();
      });
    }
  };
  
  
  const preventScroll = (e) => {
    if (mode === 'draw' || mode === 'erase') {
      e.preventDefault();
    }
  };
  
  useEffect(() => {
    // Add touchmove event listener only if mode is 'draw' or 'erase'
    window.addEventListener('touchmove', preventScroll, { passive: false });
    return () => window.removeEventListener('touchmove', preventScroll);
  }, [mode]);

  const toggleMode = (newMode) => setMode((prev) => (prev === newMode ? 'view' : newMode));
  // Handle erase functionality
  // const handleErase = (e, pageIndex) => {
  //   e.preventDefault();
  //   const { x, y } = scaleCoordinates(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, pageIndex);
  //   const eraseRadius = 10; // Radius of the erase tool to capture nearby points.
  
  //   const updatedPaths = [...drawnPaths];
  //   const pagePaths = updatedPaths[pageIndex];
  
  //   // Check if the pagePaths exists and is an array before proceeding
  //   if (Array.isArray(pagePaths)) {
  //     // Iterate over each path for the page and attempt to erase points.
  //     updatedPaths[pageIndex] = pagePaths.map((path) => {
  //       // Ensure that the path has valid points to erase
  //       if (Array.isArray(path.points) && path.points.length > 0) {
  //         // Filter points that are not within the erase radius
  //         const filteredPoints = path.points.filter((point) => {
  //           if (point && point.x !== undefined && point.y !== undefined) {
  //             const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
  //             return distance > eraseRadius; // Keep points outside of the erase radius
  //           }
  //           return true; // Ignore invalid points
  //         });
  
  //         // Return a path with the points that weren't erased
  //         return { ...path, points: filteredPoints };
  //       }
  //       return path; // Return the path unchanged if no valid points are found
  //     });
  //   }
  
  //   // Update the state with the new paths (without erased points).
  //   setDrawnPaths(updatedPaths);
  
  //   // Redraw the page annotations after updating the paths.
  //   redrawAnnotations(pageIndex);
  // };
  
  const handleErase = (e, pageIndex) => {
    e.preventDefault();
    
    // Safely extract mouse/touch coordinates
    let x, y;
    if (e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
  
    // Ensure x and y are valid
    if (x === undefined || y === undefined) {
      console.error('Invalid mouse/touch coordinates');
      return;
    }
  
    // Scale coordinates to fit the page
    const { x: scaledX, y: scaledY } = scaleCoordinates(x, y, pageIndex);
    const eraseRadius = 10; // Radius of the erase tool to capture nearby points.
    
    const updatedPaths = [...drawnPaths];
    const pagePaths = updatedPaths[pageIndex];
    
    // Check if the pagePaths exists and is an array before proceeding
    if (Array.isArray(pagePaths)) {
      // Iterate over each path for the page and attempt to erase points.
      updatedPaths[pageIndex] = pagePaths.map((path) => {
        // Ensure that the path has valid points to erase
        if (Array.isArray(path.points) && path.points.length > 0) {
          // Filter points that are not within the erase radius
          const filteredPoints = path.points.filter((point) => {
            if (point && point.x !== undefined && point.y !== undefined) {
              const distance = Math.sqrt(Math.pow(scaledX - point.x, 2) + Math.pow(scaledY - point.y, 2));
              return distance > eraseRadius; // Keep points outside of the erase radius
            }
            return true; // Ignore invalid points
          });
  
          // Return a path with the points that weren't erased
          return { ...path, points: filteredPoints };
        }
        return path; // Return the path unchanged if no valid points are found
      });
    }
  
    // Update the state with the new paths (without erased points).
    setDrawnPaths(updatedPaths);
  
    // Redraw the page annotations after updating the paths.
    redrawAnnotations(pageIndex);
  
    // Draw a temporary white line at the cursor position for visual feedback
    const canvas = canvasRefs[pageIndex]?.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(scaledX, scaledY, eraseRadius, 0, 2 * Math.PI); // Draw a circle at the erase location
      context.fillStyle = 'white'; // Set the color to white
      context.fill(); // Fill the circle
      context.lineWidth = 1;
      context.strokeStyle = 'white'; // Ensure the stroke is white
      context.stroke();
    }
  };
  

  // Handle resize for responsiveness
  const handleResize = () => {
    // Recalculate canvas size when the window is resized
    const updatedCanvasRefs = [...canvasRefs];
    updatedCanvasRefs.forEach((canvasRef, index) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (context) {
        // Redraw the annotations when the page is resized
        redrawAnnotations(index);
      }
    });
  };

  useEffect(() => {
    // Attach the resize event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRefs]);

  const getColor = (color) => {
    switch (color) {
      case 'red':
        return rgb(1, 0, 0); // RGB for Red
      case 'blue':
        return rgb(0, 0, 1); // RGB for Blue
      case 'green':
        return rgb(0, 1, 0); // RGB for Green
      case 'black':
      default:
        return rgb(0, 0, 0); // RGB for Black (default)
    }
  };
  
  const saveAnnotatedPdf = async () => {
    try {
      if (!pdfData || !(pdfData instanceof Blob)) {
        console.error('Invalid PDF data. Must be Blob.');
        return;
      }
  
      const arrayBuffer = await pdfData.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
  
      pages.forEach((page, pageIndex) => {
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
  
        // Get the canvas reference for this page
        const canvas = canvasRefs[pageIndex]?.current;
        if (!canvas) return; // Ensure canvas exists
  
        // Calculate canvas width and height
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
  
        // Loop through each path on the page
        drawnPaths[pageIndex]?.forEach((path) => {
          if (path.points.length > 1) {
            for (let i = 0; i < path.points.length - 1; i++) {
              const startX = path.points[i].x * (pageWidth / canvasWidth);  // Adjust scaling
              const startY = pageHeight - path.points[i].y * (pageHeight / canvasHeight);  // Flip Y axis for PDF-lib
              const endX = path.points[i + 1].x * (pageWidth / canvasWidth);  // Adjust scaling
              const endY = pageHeight - path.points[i + 1].y * (pageHeight / canvasHeight);  // Flip Y axis for PDF-lib
  
              page.drawLine({
                start: { x: startX, y: startY },
                end: { x: endX, y: endY },
                color: getColor(path.color), // Use the getColor function to map the color
                thickness: path.width, // Use the stored line width
              });
            }
          }
        });
      });
  
      const newPdfBytes = await pdfDoc.save();
      const updatedPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' });
  
      onSave(updatedPdfBlob); // Pass the edited Blob to the parent
    } catch (error) {
      console.error('Error saving annotated PDF:', error);
    }
  };
  




  return (
    <div style={{ position: 'relative', height: '100%', maxWidth: '100%', overflow: 'auto' }}>
      {/* Sticky Buttons */}
      <Box
        sx={{
          position: 'sticky',
          top: 10, // Keep buttons at the top when scrolling
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          zIndex: 9999, // Ensure buttons are on top
          backgroundColor: 'white', // Ensures buttons are visible
          padding: '5px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Adds shadow for visibility
          width: '100%', // Ensure buttons span full width
          flexWrap: 'wrap', // Allow buttons to wrap on small screens
          justifyContent: 'center', // Center buttons on small screens
        }}
      >
        {/* <Button onClick={handleZoomIn} variant="contained" color="primary">
          Zoom In
        </Button>
        <Button onClick={handleZoomOut} variant="contained" color="secondary">
          Zoom Out
        </Button>
        <Slider
          value={zoom}
          min={0.5}
          max={3.0}
          step={0.1}
          onChange={(e, newValue) => setZoom(newValue)}
          aria-labelledby="zoom-slider"
        /> */}
        <Typography variant="subtitle1" color="textSecondary">
          Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Typography>
        <Button
          variant="contained"
          color={mode === 'draw' ? 'secondary' : 'primary'}
          startIcon={<CreateIcon />}
          onClick={() => toggleMode('draw')}
        >
          {mode === 'draw' ? 'Stop Drawing' : 'Start Drawing'}
        </Button>
        <Button
          variant="contained"
          color={mode === 'erase' ? 'secondary' : 'primary'}
          startIcon={<DeleteIcon />}
          onClick={() => toggleMode('erase')}
        >
          {mode === 'erase' ? 'Stop Erasing' : 'Erase'}
        </Button>

        <Button variant="contained" color="primary" onClick={saveAnnotatedPdf}>
          Save Annotations
        </Button>

        {/* Color Picker */}
        <Select
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          displayEmpty
          sx={{ marginLeft: '10px' }}
        >
          <MenuItem value="black">Black</MenuItem>
          <MenuItem value="red">Red</MenuItem>
          <MenuItem value="blue">Blue</MenuItem>
          <MenuItem value="green">Green</MenuItem>
        </Select>

        {/* Line Size Slider */}
        <Slider
          value={lineWidth}
          min={1}
          max={10}
          step={1}
          onChange={(e, newValue) => setLineWidth(newValue)}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}px`}
          sx={{ width: '150px', marginLeft: '10px' }}
        />

        
      </Box>

      {/* Scrollable PDF Content */}
      <div
        style={{
          overflowY: 'auto',
          maxHeight: '80vh',
          paddingBottom: '60px', // Ensure padding so buttons don't overlap
        }}
      >
        <Document file={pdfUrl} onLoadSuccess={onLoadSuccess}>
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                marginBottom: '20px',
                width: '100%', // Ensure full width
                maxWidth: '100%',
              }}
            >
              <Page
                pageNumber={index + 1}
                onLoadSuccess={(page) => handlePageLoadSuccess(index, page)}
                // scale={1.0} // Keep the scale for responsiveness
                scale={zoom}
              />
              <canvas
                ref={canvasRefs[index]}
                width={pageDimensions.current[index]?.width || '100%'}
                height={pageDimensions.current[index]?.height || 800}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  pointerEvents: 'auto',
                  background: 'transparent',
                  cursor: mode === 'draw' ? 'crosshair' : 'default',
                  zIndex: 2,
                  width: 'auto', // Make canvas responsive to screen width
                  height: 'auto', // Maintain aspect ratio
                  
                }}
                onTouchStart={(e) => handleMouseDown(e, index)} // Touch start for mobile
                onTouchMove={(e) => mode === 'erase' && handleErase(e, index)} // Touch move for erase on mobile
                onTouchEnd={() => redrawAnnotations(index)} // Touch end for redrawing
                onMouseDown={(e) => handleMouseDown(e, index)} // Mouse events for desktop
                onMouseMove={(e) => mode === 'erase' && handleErase(e, index)} // Mouse move for erase on desktop
                onMouseUp={() => redrawAnnotations(index)} // Mouse up for redrawing
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFAnnotationComponent;
