import React, { Component } from 'react';
import { ethers } from 'ethers';
import {QRCodeCanvas} from 'qrcode.react';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                cropName: '',
                cropType: '',
                cropPrice: ''
            }
        };
    }

    handleInputChange = (e) => {
        const { id, value } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [id]: value
            }
        }));
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { cropName, cropType, cropPrice } = this.state.formData;
            
            // Convert price to Wei using ethers.js
            const priceInWei = ethers.utils.parseEther(cropPrice.toString());
            
            await this.props.addCrop(cropName, cropType, priceInWei);
            
            // Reset form
            this.setState({
                formData: {
                    cropName: '',
                    cropType: '',
                    cropPrice: ''
                }
            });
        } catch (error) {
            console.error("Error submitting crop:", error);
            alert("Error adding crop. Please check the values and try again.");
        }
    }

    formatAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    render() {
        const { formData } = this.state;
        
        return (
            <div id="content" className="container mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h1 className="card-title">Register Crop</h1>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group mb-3">
                                        <input 
                                            type="text" 
                                            id="cropName"
                                            value={formData.cropName}
                                            onChange={this.handleInputChange}
                                            className="form-control"
                                            placeholder="Crop Name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <input 
                                            type="text" 
                                            id="cropType"
                                            value={formData.cropType}
                                            onChange={this.handleInputChange}
                                            className="form-control"
                                            placeholder="Crop Type"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <input 
                                            type="number"
                                            step="0.000000000000000001"
                                            id="cropPrice"
                                            value={formData.cropPrice}
                                            onChange={this.handleInputChange}
                                            className="form-control"
                                            placeholder="Price in ETH"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Add Crop
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title">Available Crops</h2>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Price (ETH)</th>
                                                <th scope="col">Owner</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody id="CropList">
                                            {this.props.crops.map((crop, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <th scope="row">{key + 1}</th>
                                                        <td>{crop.name}</td>
                                                        <td>{crop.ctype}</td>
                                                        <td>
                                                            {ethers.utils.formatEther(crop.price)}
                                                        </td>
                                                        <td title={crop.farmerAdd}>
                                                            {this.formatAddress(crop.farmerAdd)}
                                                        </td>
                                                        <td>
                                                            {/* <span className={`badge ${crop.isVerified ? 'bg-success' : 'bg-warning'}`}>
                                                                {crop.isVerified ? 'Verified' : 'Not Verified'}
                                                            </span> */}
                                                            <QRCodeCanvas  
                                                                value={JSON.stringify({
                                                                    verified: crop.isVerified,
                                                                    cropName: crop.name,
                                                                    farmer: crop.farmerAddress
                                                                })} 
                                                                size={128} 
                                                                level={"H"} 
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;