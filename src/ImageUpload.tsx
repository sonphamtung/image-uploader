import React from 'react';
import Cropper from 'react-cropper';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import IMAGE_PLACEHOLDER from './images/image-placeholder.svg';
import ProgressBar from './ProgressBar';

interface ImageUploadProps {
    imageUrl?: string | undefined;
    handleChangeImage?: (imageUrl: string) => any;
    uploadApi: Function;
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

    getImageCropped = () =>
        new Promise((resolve) => {
            this.cropper &&
                this.cropper
                    .getCroppedCanvas({
                        imageSmoothingEnabled: true,
                        imageSmoothingQuality: 'high',
                    })
                    .toBlob((blob: Blob | null) => resolve(blob));
        });

    async cropAndUpload() {
        this.setState({
            isUploading: true,
        });
        const formData = new FormData();
        const blob = await this.getImageCropped();
        formData.append('file', blob as string | Blob);
        try {
            const {
                data: { imageUrl },
            } = await this.props.uploadApi(formData);
            this.setState({
                newImage: null,
                imageUrl,
            });
            this.props.handleChangeImage && this.props.handleChangeImage(imageUrl);
        } catch (e) {
            console.log(e);
        } finally {
            this.setState({
                isUploading: false,
            });
        }
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

    render() {
        const { imageUrl } = this.state;
        return (
            <div>
                {imageUrl ? <img src={imageUrl} /> : <IMAGE_PLACEHOLDER />}
                <div className="upload-image-button">
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => this.handleChange(e.target.files)}
                        style={{
                            position: 'absolute',
                            opacity: 0,
                            zIndex: 9,
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                        }}
                    />
                    <span>Upload avatar</span>
                </div>
                <Modal isOpen={!!this.state.newImage}>
                    <ModalHeader>Crop Image</ModalHeader>
                    <ModalBody>
                        <Cropper
                            ref={(cropper) => (this.cropper = cropper)}
                            // @ts-ignore
                            src={this.state.newImage}
                            style={{ height: 400, width: '100%' }}
                            // Cropper.js options
                            toggleDragModeOnDblclick={false}
                            viewMode={1}
                            aspectRatio={1}
                            zoomable={false}
                            autoCropArea={1}
                            guides={false}
                        />
                        <ProgressBar show={this.state.isUploading} />
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
