import React, { ReactElement, cloneElement } from 'react';
import Cropper from 'react-cropper';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ImagePlaceholder from './images/image-placeholder.svg';
import ProgressBar from './ProgressBar';

import './ImageUpload.scss';

export interface ImageUploadProps {
    className?: string;
    imageUrl?: string | undefined;
    children: React.ReactNode;
    removeElement?: ReactElement | any;
    imagePlaceholder?: React.ReactNode;

    // Action props
    onImageUploaded?: (imageUrl: string) => void;
    upload?: (formData: FormData) => Promise<{ url: string }>;
    onRemoved?: (imageUrl: string) => void;
    onUploadError?: (e: Error) => void;
}

interface State {
    newImage: string | ArrayBuffer | null;
    imageUrl: string | undefined;
    isUploading: boolean;
}

export default class ImageUpload extends React.Component<ImageUploadProps, State> {
    constructor(props: ImageUploadProps) {
        super(props);
        this.state = {
            newImage: null,
            imageUrl: undefined,
            isUploading: false,
        };
        this.cropAndUpload = this.cropAndUpload.bind(this);
        this.closeCropModal = this.closeCropModal.bind(this);
    }

    cropper: Cropper | null = null;

    componentDidMount() {
        this.setState({
            imageUrl: this.props.imageUrl,
        });
    }

    componentWillReceiveProps(nextProps: ImageUploadProps) {
        this.setState({ imageUrl: nextProps.imageUrl });
    }

    getImageCropped = (): Promise<Blob | null> =>
        new Promise((resolve) => {
            return this.cropper
                ? this.cropper
                      .getCroppedCanvas({
                          imageSmoothingEnabled: true,
                          imageSmoothingQuality: 'high',
                      })
                      .toBlob((blob: Blob | null) => resolve(blob))
                : resolve(null);
        });

    async cropAndUpload() {
        this.setState({
            isUploading: true,
        });
        const formData = new FormData();
        const blob = await this.getImageCropped();
        formData.append('file', blob as string | Blob);

        // Get image uploaded to preview
        const reader = new FileReader();
        reader.readAsDataURL(blob as Blob);
        reader.onloadend = () => {
            this.setState({
                imageUrl: reader.result as string,
            });
        };
        if (this.props.upload) {
            try {
                const { url } = await this.props.upload(formData);
                this.props.onImageUploaded && this.props.onImageUploaded(url);
            } catch (e) {
                this.props.onUploadError && this.props.onUploadError(e);
            }
        }
        this.setState({
            isUploading: false,
            newImage: null,
        });
    }

    closeCropModal() {
        this.setState({
            newImage: null,
        });
    }

    handleChange(files: FileList | null) {
        if (files && files.length) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.addEventListener('load', (e) => {
                e.preventDefault();
                this.setState({
                    newImage: e.target && e.target.result,
                });
            });
        }
    }

    handleRemoveImage = () => {
        this.setState({
            imageUrl: undefined,
        });
        this.props.onRemoved && this.props.onRemoved(this.state.imageUrl as string);
    };

    render() {
        const { imageUrl, newImage, isUploading } = this.state;
        const { className, children, removeElement, imagePlaceholder } = this.props;
        return (
            <div className={className}>
                {imageUrl ? <img className="image-preview" src={imageUrl} /> : imagePlaceholder || <ImagePlaceholder />}
                <div className="upload-image">
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => this.handleChange(e.target.files)}
                        className="upload-image__input"
                    />
                    {children}
                </div>
                {removeElement &&
                    cloneElement(removeElement, {
                        onClick: this.handleRemoveImage,
                    })}

                <Modal isOpen={!!newImage}>
                    <ModalHeader>Crop Image</ModalHeader>
                    <ModalBody>
                        <Cropper
                            ref={(cropper) => (this.cropper = cropper)}
                            src={newImage as string}
                            style={{ height: 400, width: '100%' }}
                            // Cropper.js options
                            toggleDragModeOnDblclick={false}
                            viewMode={1}
                            aspectRatio={1}
                            zoomable={true}
                            autoCropArea={1}
                            guides={false}
                        />
                        <ProgressBar show={isUploading} />
                    </ModalBody>
                    <ModalFooter toggle={this.closeCropModal}>
                        <Button color="primary" onClick={this.cropAndUpload}>
                            Crop and Save
                        </Button>
                        <Button color="secondary" onClick={this.closeCropModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
