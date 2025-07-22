'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addprice } from "../../features/filterSlice"

const PriceRangeSlider = () => {
    const { shopList } = useSelector((state) => state.filter)

    const [price, setprice] = useState({
        min: shopList.price.min,
        max: shopList.price.max,
    })

    const dispatch = useDispatch()

    // price handler
    const handleOnChange = ({ min, max }) => {
        dispatch(addprice({ min, max }))
    }

    // Handle min slider change
    const handleMinChange = (e) => {
        const newMin = parseInt(e.target.value)
        if (newMin <= price.max) {
            const newPrice = { min: newMin, max: price.max }
            setprice(newPrice)
            handleOnChange(newPrice)
        }
    }

    // Handle max slider change
    const handleMaxChange = (e) => {
        const newMax = parseInt(e.target.value)
        if (newMax >= price.min) {
            const newPrice = { min: price.min, max: newMax }
            setprice(newPrice)
            handleOnChange(newPrice)
        }
    }

    useEffect(() => {
        setprice({
            min: shopList.price.min,
            max: shopList.price.max,
        })
    }, [setprice, shopList])

    return (
        <div className="range-slider-one">
            <div className="price-range-slider">
                <div className="slider-track" style={{ 
                    position: 'relative', 
                    height: '6px', 
                    background: '#e9ecef', 
                    borderRadius: '3px',
                    margin: '20px 0'
                }}>
                    <div 
                        className="slider-range" 
                        style={{
                            position: 'absolute',
                            height: '100%',
                            background: '#007bff',
                            borderRadius: '3px',
                            left: `${(price.min / 100) * 100}%`,
                            width: `${((price.max - price.min) / 100) * 100}%`
                        }}
                    ></div>
                </div>
                
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={price.min}
                    onChange={handleMinChange}
                    className="range-input range-input-min"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '6px',
                        background: 'transparent',
                        outline: 'none',
                        pointerEvents: 'none',
                        WebkitAppearance: 'none'
                    }}
                />
                
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={price.max}
                    onChange={handleMaxChange}
                    className="range-input range-input-max"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '6px',
                        background: 'transparent',
                        outline: 'none',
                        pointerEvents: 'none',
                        WebkitAppearance: 'none'
                    }}
                />
            </div>

            <div className="input-outer">
                <div className="amount-outer">
                    <span className="area-amount">${price.min} - ${price.max}</span>
                </div>
            </div>
            
            <style jsx>{`
                .range-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #007bff;
                    cursor: pointer;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    pointer-events: all;
                    position: relative;
                    z-index: 1;
                }
                
                .range-input::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #007bff;
                    cursor: pointer;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    pointer-events: all;
                }
                
                .price-range-slider {
                    position: relative;
                    margin: 20px 0;
                }
            `}</style>
        </div>
    )
}

export default PriceRangeSlider
