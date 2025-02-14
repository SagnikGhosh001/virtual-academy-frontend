import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Typography, Box, Slider, Select, MenuItem } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { PDFDocument, rgb } from 'pdf-lib';
import ImageIcon from '@mui/icons-material/Image';

const PDFAnnotationComponent = ({ pdfData, onSave }) => {
  useEffect(() => {

    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';


  }, []);
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [mode, setMode] = useState('view'); // 'draw' or 'erase' or 'view'
  const [canvasRefs, setCanvasRefs] = useState([]);
  const [drawnPaths, setDrawnPaths] = useState(new Array()); // Array of paths for each page
  const [lineWidth, setLineWidth] = useState(2); // Default line width
  const [lineColor, setLineColor] = useState('black'); // Default color
  const pageDimensions = useRef([]);
  const [images, setImages] = useState([]); // Array of { id, x, y, width, height, src, pageIndex }
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const pdfContainerRef = useRef();
  const pageRefs = useRef([]);
  const [zoom, setZoom] = useState(1.0);
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 3.0)); // Limit zoom in to 3x
  };
  const handleResizeStart = (e, imageId) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY
    });
  };


  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Update your useEffect for resize events
  useEffect(() => {
    const handleMove = (e) => handleResize(e);
    const handleEnd = () => handleResizeEnd();
    if (isResizing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing]);

  const handleDeleteImage = () => {
    if (selectedImageId) {
      setImages(images.filter(img => img.id !== selectedImageId));
      setSelectedImageId(null);
    }
  };
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5)); // Limit zoom out to 0.5x
  };



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const container = pdfContainerRef.current;
          const pageDiv = pageRefs.current[currentPageIndex];
          let x = 100;
          let y = 100;

          if (container && pageDiv) {
            // Get container's visible area
            const containerRect = container.getBoundingClientRect();

            // Calculate center coordinates of visible area
            const viewportCenterX = containerRect.left + container.clientWidth / 2;
            const viewportCenterY = containerRect.top + container.clientHeight / 2;

            // Get page position
            const pageRect = pageDiv.getBoundingClientRect();

            // Calculate position relative to page
            const pageX = (viewportCenterX - pageRect.left) / zoom;
            const pageY = (viewportCenterY - pageRect.top) / zoom;

            // Get actual page dimensions
            const pageWidth = pageDimensions.current[currentPageIndex]?.width || 0;
            const pageHeight = pageDimensions.current[currentPageIndex]?.height || 0;

            // Clamp values to keep within page boundaries
            x = Math.max(0, Math.min(pageWidth - 100, pageX - 50));
            y = Math.max(0, Math.min(pageHeight - 100, pageY - 50));
          }

          const newImage = {
            id: Date.now(),
            x,
            y,
            width: 100,
            height: 100,
            src: img,
            pageIndex: currentPageIndex
          };
          setImages([...images, newImage]);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageMouseDown = (e, imageId, pageIndex) => {
    if (mode === 'draw' || mode === 'erase') {
      return;
    }

    // e.stopPropagation();
    setSelectedImageId(imageId);

    const canvas = canvasRefs[pageIndex]?.current;
    if (!canvas) return;

    // Get initial canvas position
    const rect = canvas.getBoundingClientRect();

    // Get starting coordinates (mouse or touch)
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    // Convert to PDF coordinates (without zoom)
    const startX = (clientX - rect.left) / zoom;
    const startY = (clientY - rect.top) / zoom;

    const currentImage = images.find(img => img.id === imageId);
    const initialX = currentImage.x;
    const initialY = currentImage.y;

    const handleMove = (moveEvent) => {
      const moveClientX = moveEvent.clientX || moveEvent.touches[0].clientX;
      const moveClientY = moveEvent.clientY || moveEvent.touches[0].clientY;

      // Convert to PDF coordinates
      const currentX = (moveClientX - rect.left) / zoom;
      const currentY = (moveClientY - rect.top) / zoom;

      setImages(images.map(img =>
        img.id === imageId ? {
          ...img,
          x: initialX + (currentX - startX),
          y: initialY + (currentY - startY),
        } : img
      ));
      redrawAnnotations(pageIndex);
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
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
    pageRefs.current = new Array(numPages);

  };

  const handlePageLoadSuccess = (index, { originalWidth, originalHeight }) => {
    pageDimensions.current[index] = { width: originalWidth, height: originalHeight };
    adjustCanvasSize(index); // Adjust canvas size when the page loads
  };
  useEffect(() => {
    canvasRefs.forEach((_, index) => adjustCanvasSize(index));
  }, [zoom]);

  const adjustCanvasSize = (index) => {
    const canvas = canvasRefs[index]?.current;
    if (canvas && pageDimensions.current[index]) {
      const { width, height } = pageDimensions.current[index];
      canvas.width = width * zoom;
      canvas.height = height * zoom;
      redrawAnnotations(index);
    }
  };

  const scaleCoordinates = (clientX, clientY, pageIndex) => {
    const canvas = canvasRefs[pageIndex]?.current;
    if (!canvas || !pageDimensions.current[pageIndex]) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = (pageDimensions.current[pageIndex].width * zoom) / rect.width;
    const scaleY = (pageDimensions.current[pageIndex].height * zoom) / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e, pageIndex) => {
    e.preventDefault();
    const canvas = canvasRefs[pageIndex]?.current;
    const context = canvas?.getContext('2d');
    if (context && mode !== 'view') {
      const path = {
        points: [],
        color: lineColor,
        width: lineWidth,
        // Store original page dimensions and current zoom
        originalWidth: pageDimensions.current[pageIndex].width,
        originalHeight: pageDimensions.current[pageIndex].height,
        zoomLevel: zoom, // Zoom level when the path was drawn
      };
      const { x, y } = scaleCoordinates(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, pageIndex);
      context.beginPath();
      context.moveTo(x, y);
      path.points.push({ x, y });

      const draw = (moveEvent) => {
        const { x: moveX, y: moveY } = scaleCoordinates(
          moveEvent.clientX || moveEvent.touches[0].clientX,
          moveEvent.clientY || moveEvent.touches[0].clientY,
          pageIndex
        );
        context.lineTo(moveX, moveY);
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;
        context.stroke();
        if (mode === 'draw') path.points.push({ x: moveX, y: moveY });
      };

      const stopDrawing = () => {
        if (mode === 'draw') {
          const updatedPaths = [...drawnPaths];
          updatedPaths[pageIndex] = [...updatedPaths[pageIndex], path];
          setDrawnPaths(updatedPaths);
        }
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
      };

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
      context.clearRect(0, 0, canvas.width, canvas.height);

      drawnPaths[index].forEach((path) => {
        context.beginPath();
        const scaleFactor = zoom / path.zoomLevel; // Calculate the scale factor
        context.moveTo(path.points[0].x * scaleFactor, path.points[0].y * scaleFactor);
        path.points.forEach((point) => {
          context.lineTo(point.x * scaleFactor, point.y * scaleFactor);
        });
        context.strokeStyle = path.color;
        context.lineWidth = path.width;
        context.stroke();
      });
      drawImages(context, index);
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




  // Add a helper function to calculate distance from a point to a line segment
  const distanceToSegment = (x, y, x1, y1, x2, y2) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleErase = (e, pageIndex) => {
    e.preventDefault();

    // Only proceed if the mouse button is pressed or a touch is active
    if (!(e.buttons === 1 || e.touches)) return;

    let x, y;
    if (e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else if (e.touches?.[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      return;
    }

    const { x: scaledX, y: scaledY } = scaleCoordinates(x, y, pageIndex);
    const eraseRadius = 10;

    const updatedPaths = [...drawnPaths];
    const pagePaths = updatedPaths[pageIndex];

    if (Array.isArray(pagePaths)) {
      updatedPaths[pageIndex] = pagePaths.flatMap((path) => {
        if (path.points.length < 2) return [path]; // No segments to erase

        const newPaths = [];
        let currentPath = [path.points[0]];

        for (let i = 0; i < path.points.length - 1; i++) {
          const start = path.points[i];
          const end = path.points[i + 1];
          const distance = distanceToSegment(scaledX, scaledY, start.x, start.y, end.x, end.y);

          if (distance < eraseRadius) {
            newPaths.push({ ...path, points: [...currentPath] });
            currentPath = [end]; // Start new path after the erased segment
          } else {
            currentPath.push(end);
          }
        }

        if (currentPath.length > 0) {
          newPaths.push({ ...path, points: currentPath });
        }

        return newPaths;
      });
    }

    setDrawnPaths(updatedPaths);
    redrawAnnotations(pageIndex);

    // Visual feedback for erase
    const canvas = canvasRefs[pageIndex]?.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(scaledX, scaledY, eraseRadius, 0, 2 * Math.PI);
      context.fillStyle = 'white';
      context.fill();
      context.strokeStyle = 'white';
      context.stroke();
    }
  };

  const handleResize = (e) => {
    if (!isResizing || !selectedImageId) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const currentImage = images.find(img => img.id === selectedImageId);
    const deltaX = (clientX - resizeStart.x) / zoom;
    const deltaY = (clientY - resizeStart.y) / zoom;

    setImages(images.map(img =>
      img.id === selectedImageId ? {
        ...img,
        width: Math.max(50, img.width + deltaX),
        height: Math.max(50, img.height + deltaY),
      } : img
    ));

    setResizeStart({ x: e.clientX, y: e.clientY });
  };

  // Draw images on canvas
  const drawImages = (ctx, pageIndex) => {
    images.filter(img => img.pageIndex === pageIndex).forEach(img => {
      ctx.drawImage(
        img.src,
        img.x * zoom, // Scale x by zoom
        img.y * zoom, // Scale y by zoom
        img.width * zoom, // Scale width by zoom
        img.height * zoom // Scale height by zoom
      );

      // Draw resize handle
      if (selectedImageId === img.id) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(
          (img.x + img.width) * zoom - 5, // Scale handle position by zoom
          (img.y + img.height) * zoom - 5, // Scale handle position by zoom
          10,
          10
        );
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
      for (const image of images) {
        const page = pages[image.pageIndex];
        const dataUrl = image.src.src;

        // Extract MIME type from data URL
        const mimeType = dataUrl.split(';')[0].split(':')[1];

        // Convert data URL to Uint8Array
        const base64Data = dataUrl.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteArray = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        // Embed based on image type
        let pdfImage;
        if (mimeType === 'image/png') {
          pdfImage = await pdfDoc.embedPng(byteArray);
        } else if (mimeType === 'image/jpeg') {
          pdfImage = await pdfDoc.embedJpg(byteArray);
        } else {
          console.warn('Unsupported image type:', mimeType);
          continue;
        }

        page.drawImage(pdfImage, {
          x: image.x,
          y: page.getHeight() - image.y - image.height,
          width: image.width,
          height: image.height,
        });
      }
      pages.forEach((page, pageIndex) => {
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        drawnPaths[pageIndex]?.forEach((path) => {
          if (path.points.length > 1) {
            // Calculate scaling factors based on stored original dimensions
            const scaleX = pageWidth / path.originalWidth;
            const scaleY = pageHeight / path.originalHeight;

            for (let i = 0; i < path.points.length - 1; i++) {
              // Adjust for the zoom level when the path was drawn
              const startX = (path.points[i].x / path.zoomLevel) * scaleX;
              const startY = (path.points[i].y / path.zoomLevel) * scaleY;
              const endX = (path.points[i + 1].x / path.zoomLevel) * scaleX;
              const endY = (path.points[i + 1].y / path.zoomLevel) * scaleY;

              // Draw the line in PDF coordinates (Y-axis is inverted)
              page.drawLine({
                start: { x: startX, y: pageHeight - startY },
                end: { x: endX, y: pageHeight - endY },
                color: getColor(path.color),
                thickness: path.width,
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
          top: 0, // Stick to the very top
          display: 'flex',
          gap: { xs: '6px', sm: '10px' }, // Smaller gap on mobile
          alignItems: 'center',
          zIndex: 9999,
          backgroundColor: 'white',
          padding: { xs: '4px', sm: '6px' },
          boxShadow: 3,
          width: '100%',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Zoom Controls */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleZoomIn}
            sx={{
              minWidth: 'auto',
              px: { xs: 1, sm: 2 },
              '& .MuiButton-startIcon': { margin: 0 }
            }}
          >
            +
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleZoomOut}
            sx={{
              minWidth: 'auto',
              px: { xs: 1, sm: 2 },
              '& .MuiButton-startIcon': { margin: 0 }
            }}
          >
            -
          </Button>
        </Box>

        {/* Zoom Slider */}
        <Slider
          value={zoom}
          min={0.5}
          max={3.0}
          step={0.1}
          onChange={(e, newValue) => setZoom(newValue)}
          sx={{
            width: { xs: '100px', sm: '150px' },
            mx: { xs: 1, sm: 2 }
          }}
        />
       {mode==='view' &&
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-upload"
        />}
        {/* Add Image Button */}
        <label htmlFor="image-upload">
          <Button
            variant="contained"
            component="span"
            disabled= {mode==='view' ? false : true}
            sx={{
              px: { xs: 1, sm: 2 },
              '& .MuiButton-startIcon': { margin: 0 }
            }}
          >
            <ImageIcon sx={{ display: { xs: 'inline', sm: 'none' } }} />
            <Typography
              variant="button"
              sx={{ display: { xs: 'none', sm: 'inline' }, ml: 1 }}
            >
              Add Image
            </Typography>
          </Button>
        </label>
        {selectedImageId && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteImage}
            sx={{
              px: { xs: 1, sm: 2 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            <DeleteIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
          </Button>
        )}

        {/* Page Selection (only when image selected) */}
        {selectedImageId && numPages !== null && (
          <Select
            value={images.find(img => img.id === selectedImageId).pageIndex}
            onChange={(e) => {
              const newPageIndex = parseInt(e.target.value);
              setImages(images.map(img =>
                img.id === selectedImageId ? { ...img, pageIndex: newPageIndex } : img
              )); // Added missing closing parenthesis here
            }}
            sx={{
              minWidth: '80px',
              height: '36px',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <MenuItem value={i} key={i} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Page {i + 1}
              </MenuItem>
            ))}
          </Select>
        )}


        {/* Mode Buttons */}
        <Box sx={{ display: 'flex', gap: 0 }}>
          <Button
            variant="contained"
            color={mode === 'draw' ? 'secondary' : 'primary'}
            onClick={() => toggleMode('draw')}
            sx={{
              px: { xs: 1, sm: 2 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {mode === 'draw' ? 'Stop' : 'Draw'}
          </Button>

          {mode === 'draw' &&
            <>

              <Select
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                displayEmpty
                sx={{
                  minWidth: '80px',
                  height: '36px',
                  fontSize: { marginLeft: '10px', xs: '0.75rem', sm: '0.875rem' }
                }}

              >
                <MenuItem value="black">Black</MenuItem>
                <MenuItem value="red">Red</MenuItem>
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="green">Green</MenuItem>
              </Select>

              <Slider
                value={lineWidth}
                min={1}
                max={10}
                step={1}
                onChange={(e, newValue) => setLineWidth(newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}px`}
                sx={{ width: '100px', marginLeft: '10px' }}
              />
            </>
          }
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color={mode === 'erase' ? 'secondary' : 'primary'}
            onClick={() => toggleMode('erase')}
            sx={{
              px: { xs: 1, sm: 2 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {mode === 'erase' ? 'Stop' : 'Erase'}
          </Button>
        </Box>



        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={saveAnnotatedPdf}
          sx={{
            px: { xs: 1, sm: 2 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Save
        </Button>
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
              ref={(el) => (pageRefs.current[index] = el)}
              style={{ position: 'relative', marginBottom: '20px', width: '100%' }}
              onClick={() => {
                if (mode === 'view') {
                  setCurrentPageIndex(index);
                }
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
                  // touchAction: 'none',
                  pointerEvents: 'auto',
                  background: 'transparent',
                  // touchAction: 'pan-y',
                  // pointerEvents: mode === 'view' ? 'none' : 'auto',
                  cursor: mode === 'draw' ? 'crosshair' : 'default',
                  zIndex: 2,
                  width: 'auto', // Make canvas responsive to screen width
                  height: 'auto', // Maintain aspect ratio

                }}
                onTouchStart={(e) => handleMouseDown(e, index)} // Touch start for mobile
                onTouchMove={(e) => mode === 'erase' && handleErase(e, index)} // Touch move for erase on mobile
                onTouchEnd={() => redrawAnnotations(index)} // Touch end for redrawing
                onMouseDown={(e) => handleMouseDown(e, index)} // Mouse events for desktop
                onMouseMove={(e) => { mode === 'erase' && handleErase(e, index) }} // Mouse move for erase on desktop
                onMouseUp={() => redrawAnnotations(index)} // Mouse up for redrawing
              />
              {images.filter(img => img.pageIndex === index).map(img => (
                <div
                  key={img.id}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transform: `translate(${img.x * zoom}px, ${img.y * zoom}px)`,
                    width: `${img.width * zoom}px`,
                    height: `${img.height * zoom}px`,
                    cursor: 'move',
                    border: selectedImageId === img.id ? '2px dashed blue' : 'none',
                    touchAction: 'none', // Prevent default touch behaviors
                    zIndex: 2, // Higher than canvas
                  }}
                  onMouseDown={(e) => {
                    if (mode !== 'view') return;
                    e.stopPropagation();
                    handleImageMouseDown(e, img.id, index);
                  }}
                  onTouchStart={(e) => {
                    if (mode !== 'view') return;
                    e.preventDefault();
                    e.stopPropagation();
                    handleImageMouseDown(e, img.id, index);
                  }}
                >
                  {selectedImageId === img.id && (
                    <div
                      style={{
                        position: 'absolute',
                        right: -8,
                        bottom: -8,
                        width: 16,
                        height: 16,
                        backgroundColor: 'blue',
                        borderRadius: '50%',
                        cursor: 'nwse-resize'
                      }}
                      onMouseDown={(e) => handleResizeStart(e, img.id)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleResizeStart(e, img.id)
                      }}
                   
                    />
                  )}
                </div>
              ))}

            </div>

          ))}

        </Document>
      </div>
    </div>
  );
};

export default PDFAnnotationComponent;
