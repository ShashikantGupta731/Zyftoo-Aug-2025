'use client'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/util/productPricingHelper'

export default function CorporatePricingAdmin({ productId, onSave, initialData = null }) {
    const [corporatePricing, setCorporatePricing] = useState({
        enabled: false,
        minimumOrderQuantity: 1,
        priceTiers: [],
        customQuoteThreshold: null
    })

    const [newTier, setNewTier] = useState({
        minQuantity: '',
        maxQuantity: '',
        pricePerUnit: '',
        discount: '',
        description: ''
    })

    useEffect(() => {
        if (initialData) {
            setCorporatePricing(initialData)
        }
    }, [initialData])

    const addTier = () => {
        if (newTier.minQuantity && newTier.pricePerUnit) {
            const tier = {
                minQuantity: parseInt(newTier.minQuantity),
                maxQuantity: newTier.maxQuantity ? parseInt(newTier.maxQuantity) : null,
                pricePerUnit: parseFloat(newTier.pricePerUnit),
                discount: parseFloat(newTier.discount) || 0,
                description: newTier.description || ''
            }

            setCorporatePricing(prev => ({
                ...prev,
                priceTiers: [...prev.priceTiers, tier].sort((a, b) => a.minQuantity - b.minQuantity)
            }))

            setNewTier({
                minQuantity: '',
                maxQuantity: '',
                pricePerUnit: '',
                discount: '',
                description: ''
            })
        }
    }

    const removeTier = (index) => {
        setCorporatePricing(prev => ({
            ...prev,
            priceTiers: prev.priceTiers.filter((_, i) => i !== index)
        }))
    }

    const handleSave = () => {
        onSave(productId, corporatePricing)
    }

    return (
        <div className="corporate-pricing-admin">
            <div className="card">
                <div className="card-header">
                    <h5>Corporate Pricing Configuration</h5>
                </div>
                <div className="card-body">
                    {/* Enable/Disable Toggle */}
                    <div className="form-check form-switch mb-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="enableCorporatePricing"
                            checked={corporatePricing.enabled}
                            onChange={(e) => setCorporatePricing(prev => ({
                                ...prev,
                                enabled: e.target.checked
                            }))}
                        />
                        <label className="form-check-label" htmlFor="enableCorporatePricing">
                            <strong>Enable Corporate Pricing</strong>
                        </label>
                    </div>

                    {corporatePricing.enabled && (
                        <>
                            {/* Basic Settings */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">Minimum Order Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={corporatePricing.minimumOrderQuantity}
                                        onChange={(e) => setCorporatePricing(prev => ({
                                            ...prev,
                                            minimumOrderQuantity: parseInt(e.target.value) || 1
                                        }))}
                                        min="1"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Custom Quote Threshold (Optional)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={corporatePricing.customQuoteThreshold || ''}
                                        onChange={(e) => setCorporatePricing(prev => ({
                                            ...prev,
                                            customQuoteThreshold: e.target.value ? parseInt(e.target.value) : null
                                        }))}
                                        placeholder="e.g., 1000"
                                    />
                                    <small className="form-text text-muted">
                                        Orders above this quantity will show "Request Quote"
                                    </small>
                                </div>
                            </div>

                            {/* Price Tiers */}
                            <div className="mb-4">
                                <h6>Price Tiers</h6>
                                
                                {/* Existing Tiers */}
                                {corporatePricing.priceTiers.length > 0 && (
                                    <div className="table-responsive mb-3">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Min Qty</th>
                                                    <th>Max Qty</th>
                                                    <th>Price/Unit</th>
                                                    <th>Discount %</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {corporatePricing.priceTiers.map((tier, index) => (
                                                    <tr key={index}>
                                                        <td>{tier.minQuantity}</td>
                                                        <td>{tier.maxQuantity || '∞'}</td>
                                                        <td>{formatPrice(tier.pricePerUnit)}</td>
                                                        <td>{tier.discount}%</td>
                                                        <td>{tier.description}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => removeTier(index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Add New Tier */}
                                <div className="border p-3 bg-light rounded">
                                    <h6>Add New Price Tier</h6>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <label className="form-label">Min Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newTier.minQuantity}
                                                onChange={(e) => setNewTier(prev => ({
                                                    ...prev,
                                                    minQuantity: e.target.value
                                                }))}
                                                placeholder="50"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Max Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newTier.maxQuantity}
                                                onChange={(e) => setNewTier(prev => ({
                                                    ...prev,
                                                    maxQuantity: e.target.value
                                                }))}
                                                placeholder="99 (empty for ∞)"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Price/Unit (₹)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                value={newTier.pricePerUnit}
                                                onChange={(e) => setNewTier(prev => ({
                                                    ...prev,
                                                    pricePerUnit: e.target.value
                                                }))}
                                                placeholder="450"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Discount %</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newTier.discount}
                                                onChange={(e) => setNewTier(prev => ({
                                                    ...prev,
                                                    discount: e.target.value
                                                }))}
                                                placeholder="10"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newTier.description}
                                                onChange={(e) => setNewTier(prev => ({
                                                    ...prev,
                                                    description: e.target.value
                                                }))}
                                                placeholder="Small bulk discount"
                                            />
                                        </div>
                                        <div className="col-md-1">
                                            <label className="form-label">&nbsp;</label>
                                            <button
                                                className="btn btn-success d-block"
                                                onClick={addTier}
                                                disabled={!newTier.minQuantity || !newTier.pricePerUnit}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            {corporatePricing.priceTiers.length > 0 && (
                                <div className="alert alert-info">
                                    <h6>Preview:</h6>
                                    <ul className="mb-0">
                                        {corporatePricing.priceTiers.map((tier, index) => (
                                            <li key={index}>
                                                {tier.minQuantity} - {tier.maxQuantity || '∞'} units: 
                                                <strong> {formatPrice(tier.pricePerUnit)}/unit</strong>
                                                {tier.discount > 0 && <span className="text-success"> ({tier.discount}% off)</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}

                    {/* Save Button */}
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            Save Corporate Pricing
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .corporate-pricing-admin {
                    max-width: 100%;
                }
                
                .table th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                }
                
                .form-check-input:checked {
                    background-color: #007bff;
                    border-color: #007bff;
                }
                
                .alert-info {
                    border-left: 4px solid #007bff;
                }
            `}</style>
        </div>
    )
}
