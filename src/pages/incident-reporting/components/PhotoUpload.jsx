import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PhotoUpload = ({ photos, onPhotosChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const maxPhotos = 5;
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files)?.filter(file => {
      if (!acceptedTypes?.includes(file?.type)) {
        alert(`Tipo de archivo no válido: ${file?.name}. Solo se permiten JPG, PNG y WebP.`);
        return false;
      }
      if (file?.size > maxFileSize) {
        alert(`Archivo muy grande: ${file?.name}. Máximo 10MB permitido.`);
        return false;
      }
      return true;
    });

    if (photos?.length + validFiles?.length > maxPhotos) {
      alert(`Máximo ${maxPhotos} fotos permitidas. Selecciona menos archivos.`);
      return;
    }

    const newPhotos = validFiles?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file?.name,
      size: file?.size,
      altText: '',
      isProcessing: true
    }));

    // Simulate processing delay
    setTimeout(() => {
      const processedPhotos = newPhotos?.map(photo => ({
        ...photo,
        isProcessing: false
      }));
      onPhotosChange([...photos, ...processedPhotos]);
    }, 1000);

    onPhotosChange([...photos, ...newPhotos]);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const files = e?.dataTransfer?.files;
    handleFileSelect(files);
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e?.target?.files);
    e.target.value = '';
  };

  const handleCameraCapture = (e) => {
    setIsCapturing(true);
    handleFileSelect(e?.target?.files);
    e.target.value = '';
    setTimeout(() => setIsCapturing(false), 500);
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos?.filter(photo => photo?.id !== photoId);
    onPhotosChange(updatedPhotos);
  };

  const updateAltText = (photoId, altText) => {
    const updatedPhotos = photos?.map(photo =>
      photo?.id === photoId ? { ...photo, altText } : photo
    );
    onPhotosChange(updatedPhotos);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Documentación Fotográfica
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Agrega fotos del incidente para ayudar en la evaluación y resolución (máximo {maxPhotos} fotos)
        </p>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Icon name="ImagePlus" size={32} className="text-muted-foreground" />
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">
              Arrastra fotos aquí o selecciona archivos
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              JPG, PNG o WebP hasta 10MB cada una
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              iconName="Upload"
              iconPosition="left"
            >
              Seleccionar Archivos
            </Button>
            
            <Button
              variant="outline"
              onClick={() => cameraInputRef?.current?.click()}
              iconName="Camera"
              iconPosition="left"
              loading={isCapturing}
            >
              Tomar Foto
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </div>
      {/* Photo Preview Grid */}
      {photos?.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">
            Fotos Seleccionadas ({photos?.length}/{maxPhotos})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos?.map((photo) => (
              <div key={photo?.id} className="relative bg-card border border-border rounded-lg overflow-hidden">
                {/* Photo Preview */}
                <div className="relative aspect-video bg-muted">
                  {photo?.isProcessing ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : (
                    <Image
                      src={photo?.url}
                      alt={photo?.altText || `Foto del incidente ${photo?.name}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removePhoto(photo?.id)}
                    className="absolute top-2 right-2 w-8 h-8"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>

                {/* Photo Details */}
                <div className="p-3 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {photo?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(photo?.size / 1024 / 1024)?.toFixed(1)} MB
                    </p>
                  </div>

                  {/* Alt Text Input */}
                  <Input
                    type="text"
                    placeholder="Describe qué muestra esta foto..."
                    value={photo?.altText}
                    onChange={(e) => updateAltText(photo?.id, e?.target?.value)}
                    description="Descripción para accesibilidad"
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Guidelines */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h5 className="font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Camera" size={16} />
          <span>Consejos para Mejores Fotos</span>
        </h5>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-start space-x-2">
            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
            <span>Toma fotos desde diferentes ángulos para mostrar el problema completo</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
            <span>Incluye referencias de tamaño (personas, objetos conocidos)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
            <span>Asegúrate de que haya buena iluminación y las fotos estén enfocadas</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
            <span>Evita incluir información personal o sensible en las fotos</span>
          </li>
        </ul>
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;