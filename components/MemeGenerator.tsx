'use client';

import { useState, useEffect, useRef } from 'react';
import { useDB } from '@/components/InstantDBProvider';
import { id } from '@instantdb/react';

const templateImages = [
  '/Assets/Kitty_1.jpg',
  '/Assets/kitty_2.jpg',
  '/Assets/kitty_3.jpg',
  '/Assets/leaping kitty.jpg',
  '/Assets/smiling kitty.jpg',
];

interface TextObject {
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  dragOffset: { x: number; y: number };
}

export default function MemeGenerator() {
  const db = useDB();
  if (!db) {
    return <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>Loading...</div>;
  }

  const { user } = db.useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [textObjects, setTextObjects] = useState<TextObject[]>([]);
  const [currentTextSize, setCurrentTextSize] = useState(40);
  const [currentTextColor, setCurrentTextColor] = useState('#ffffff');
  const [draggedTextIndex, setDraggedTextIndex] = useState(-1);
  const [selectedTextIndex, setSelectedTextIndex] = useState(-1);
  const [textInput, setTextInput] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (canvasRef.current && image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      drawCanvas(ctx, canvas);
    }
  }, [image, textObjects, selectedTextIndex]);

  const loadImage = (source: string | File) => {
    const img = new Image();
    
    img.onload = () => {
      setImage(img);
      
      const maxWidth = 800;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };
    
    img.onerror = () => {
      alert('Failed to load image. Please try another one.');
    };
    
    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(source);
    }
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!image) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    textObjects.forEach((textObj, index) => {
      if (textObj.text) {
        ctx.font = `${textObj.size}px Arial`;
        ctx.fillStyle = textObj.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        
        if (index === selectedTextIndex) {
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = Math.max(3, textObj.size / 15);
        } else {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = Math.max(2, textObj.size / 20);
        }
        
        ctx.strokeText(textObj.text, textObj.x, textObj.y);
        ctx.fillText(textObj.text, textObj.x, textObj.y);
      }
    });
  };

  const handleTextInput = (value: string) => {
    if (draggedTextIndex !== -1) return;
    
    setTextInput(value);
    const lines = value.split('\n');
    
    setTextObjects((prev) => {
      const newObjects = [...prev];
      
      lines.forEach((line, index) => {
        if (index < newObjects.length) {
          newObjects[index].text = line;
          newObjects[index].size = currentTextSize;
          if (index === selectedTextIndex || selectedTextIndex === -1) {
            newObjects[index].color = currentTextColor;
          }
        } else {
          const canvas = canvasRef.current;
          let x, y;
          if (newObjects.length > 0) {
            const lastLine = newObjects[newObjects.length - 1];
            x = typeof lastLine.x === 'number' ? lastLine.x : (canvas ? canvas.width / 2 : 400);
            y = typeof lastLine.y === 'number' ? lastLine.y + (currentTextSize * 1.2) : (canvas ? canvas.height / 2 : 300);
          } else {
            x = canvas ? canvas.width / 2 : 400;
            y = canvas ? canvas.height / 2 : 300;
          }
          
          newObjects.push({
            text: line,
            x,
            y,
            size: currentTextSize,
            color: currentTextColor,
            dragOffset: { x: 0, y: 0 },
          });
        }
      });
      
      return newObjects.slice(0, lines.length);
    });
  };

  const getTextObjectAtPoint = (x: number, y: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return -1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return -1;
    
    for (let i = textObjects.length - 1; i >= 0; i--) {
      const textObj = textObjects[i];
      if (!textObj.text) continue;
      
      ctx.font = `${textObj.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const metrics = ctx.measureText(textObj.text);
      const width = metrics.width;
      const height = textObj.size;
      
      const left = textObj.x - width / 2;
      const right = textObj.x + width / 2;
      const top = textObj.y - height / 2;
      const bottom = textObj.y + height / 2;
      
      if (x >= left && x <= right && y >= top && y <= bottom) {
        return i;
      }
    }
    return -1;
  };

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const handleDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!image || textObjects.length === 0) return;
    
    const pos = getEventPos(e);
    const textIndex = getTextObjectAtPoint(pos.x, pos.y);
    
    if (textIndex !== -1) {
      setSelectedTextIndex(textIndex);
      setDraggedTextIndex(textIndex);
      
      setTextObjects((prev) => {
        const newObjects = [...prev];
        if (!newObjects[textIndex].dragOffset) {
          newObjects[textIndex].dragOffset = { x: 0, y: 0 };
        }
        newObjects[textIndex].dragOffset.x = pos.x - newObjects[textIndex].x;
        newObjects[textIndex].dragOffset.y = pos.y - newObjects[textIndex].y;
        return newObjects;
      });
      
      e.preventDefault();
    } else {
      setSelectedTextIndex(-1);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!image || draggedTextIndex === -1) return;
    
    const pos = getEventPos(e);
    
    setTextObjects((prev) => {
      const newObjects = [...prev];
      const draggedObj = newObjects[draggedTextIndex];
      
      if (!draggedObj || !draggedObj.text) return prev;
      
      if (!draggedObj.dragOffset) {
        draggedObj.dragOffset = { x: 0, y: 0 };
      }
      
      const canvas = canvasRef.current;
      if (!canvas) return prev;
      
      const newX = pos.x - draggedObj.dragOffset.x;
      const newY = pos.y - draggedObj.dragOffset.y;
      
      const padding = 20;
      const clampedX = Math.max(padding, Math.min(canvas.width - padding, newX));
      const clampedY = Math.max(padding, Math.min(canvas.height - padding, newY));
      
      draggedObj.x = clampedX;
      draggedObj.y = clampedY;
      
      return [...newObjects];
    });
    
    e.preventDefault();
  };

  const handleUp = () => {
    setDraggedTextIndex(-1);
  };

  const handlePostMeme = async () => {
    if (!user) {
      alert('Please sign in to post memes');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      alert('Please create a meme first');
      return;
    }
    
    setPosting(true);
    try {
      // Draw canvas to ensure it's up to date
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawCanvas(ctx, canvas);
      }
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/png');
      });
      
      // Upload to InstantDB storage
      const file = new File([blob], `meme-${Date.now()}.png`, { type: 'image/png' });
      
      // Try InstantDB storage API - if it doesn't exist, use base64 fallback
      let imageUrl: string;
      try {
        // InstantDB storage upload - requires pathname and file
        const pathname = `memes/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const uploadSuccess = await db.storage.upload(pathname, file);
        
        if (uploadSuccess) {
          // Get the download URL for the uploaded file
          imageUrl = await db.storage.getDownloadUrl(pathname);
        } else {
          throw new Error('Upload failed');
        }
      } catch (storageError) {
        // Fallback to base64 if storage API doesn't work
        console.warn('Storage API not available, using base64:', storageError);
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      
      // Save meme to database
      const textConfig = textObjects.map(({ x, y, size, color }) => ({ x, y, size, color }));
      
      const memeId = id();
      await db.transact(
        db.tx.memes[memeId].update({
          imageUrl: imageUrl,
          text: textInput,
          textConfig: JSON.stringify(textConfig),
          createdAt: Date.now(),
          userId: user.id,
          upvoteCount: 0,
        })
      );
      
      alert('Meme posted successfully!');
      // Reset form
      setTextInput('');
      setTextObjects([]);
      setImage(null);
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
    } catch (error) {
      console.error('Error posting meme:', error);
      alert('Failed to post meme. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Meme Generator</h1>
        <p>Upload an image, add text, and create your meme!</p>
      </header>

      <div className="main-content">
        <div className="controls-panel">
          <div className="control-group">
            <label className="section-label">Choose Template or Upload</label>
            <div className="template-gallery">
              {templateImages.map((imagePath, index) => (
                <div
                  key={index}
                  className="template-item"
                  onClick={() => loadImage(imagePath)}
                >
                  <img src={imagePath} alt={`Template ${index + 1}`} className="template-thumbnail" />
                </div>
              ))}
            </div>
            <label htmlFor="imageInput" className="file-label">
              <span>📷 Upload Your Own Image</span>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) loadImage(file);
                }}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="control-group">
            <label htmlFor="textInput">Text:</label>
            <textarea
              id="textInput"
              placeholder="Enter your meme text...&#10;Press Enter for new lines"
              rows={3}
              value={textInput}
              onChange={(e) => handleTextInput(e.target.value)}
            />
          </div>

          <div className="control-group">
            <label htmlFor="textSize">
              Text Size: <span className="size-value">{currentTextSize}</span>px
            </label>
            <input
              type="range"
              id="textSize"
              min="20"
              max="100"
              value={currentTextSize}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setCurrentTextSize(size);
                setTextObjects((prev) =>
                  prev.map((obj) => ({ ...obj, size }))
                );
              }}
            />
          </div>

          <div className="control-group">
            <label htmlFor="textColor">
              Text Color:{' '}
              <span>
                {selectedTextIndex !== -1
                  ? `(Line ${selectedTextIndex + 1} of ${textObjects.length})`
                  : '(All lines)'}
              </span>
            </label>
            <input
              type="color"
              id="textColor"
              value={currentTextColor}
              onChange={(e) => {
                const color = e.target.value;
                setCurrentTextColor(color);
                setTextObjects((prev) => {
                  const newObjects = [...prev];
                  if (selectedTextIndex !== -1 && selectedTextIndex >= 0 && selectedTextIndex < newObjects.length) {
                    newObjects[selectedTextIndex].color = color;
                  } else {
                    newObjects.forEach((obj) => {
                      obj.color = color;
                    });
                  }
                  return newObjects;
                });
              }}
            />
            <small style={{ display: 'block', marginTop: '5px', color: '#888', fontSize: '0.85rem' }}>
              Click on a text line to change its color individually
            </small>
          </div>

          <div className="control-group">
            <button
              onClick={handlePostMeme}
              disabled={!image || posting}
            >
              {posting ? 'Posting...' : 'Post Meme'}
            </button>
          </div>

          <div className="control-group">
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas || !image) {
                  alert('Please upload or select an image first.');
                  return;
                }
                
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  drawCanvas(ctx, canvas);
                }
                
                setTimeout(() => {
                  const dataURL = canvas.toDataURL('image/png');
                  const link = document.createElement('a');
                  link.download = 'meme.png';
                  link.href = dataURL;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }, 100);
              }}
              disabled={!image}
            >
              Download Meme
            </button>
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            className={`canvas ${image ? 'active' : ''}`}
            onMouseDown={handleDown}
            onMouseMove={handleMove}
            onMouseUp={handleUp}
            onTouchStart={handleDown}
            onTouchMove={handleMove}
            onTouchEnd={handleUp}
          />
          {!image && (
            <div className="placeholder">
              <p>Upload an image to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

