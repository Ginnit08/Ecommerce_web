import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from "../common"
import { FaStar } from "react-icons/fa"
import { FaStarHalf } from "react-icons/fa"
import displayUSDCurrency from '../helpers/displayCurrency'

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })

  const params = useParams()
  const [loading, setLoading] = useState(false)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage, setActiveImage] = useState("")

  const [zoomImageCoordinate, setZoomCoordinate] = useState({
    x: 0,
    y: 0
  })

  const fetchProductDetails = async() => {
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type" : "application/json"
      },
      body: JSON.stringify({
        productId: params?.id
      })
    }) 
    setLoading(false)

    const dataResponse = await response.json()

    setData(dataResponse?.data)
    setActiveImage(dataResponse?.data?.productImage[0])

  }

  useEffect(()=> {
    fetchProductDetails()
  }, [])

  const handleMouseEnterproduct = (imageURL) => {
    setActiveImage(imageURL)
  }

  const handleZoomImage = (e) => {
    const {left, top, width, height} = e.target.getBoundingClientRect()
    console.log("coordinater: ", left, top, width, height)
  }
  
  return (
    <div className='container mx-auto p-4'>

      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>

        {/* product image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>  
          <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative'>
            <img 
              src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply'
              onMouseEnter={handleZoomImage}
            />

            {/* product zoom */}
            <div className='hidden lg:block absolute min-w-[400px] min-h-[400px] bg-slate-200 p-1 -right-[410px] top-0'>
              <div
                className='w-full h-full min-w-[400px] min-h-[400px] mix-blend-multiply'
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundRepeat: 'no-repeat'
                }}
              >

              </div>
            </div>

          </div>

          <div className='h-full'> 
            {
              loading ? (
                <div className='flex gap-2 lg:flex-col h-full overflow-scroll scrollbar-none'>
                  {
                    productImageListLoading.map(el=>{
                      return (
                        <div className='h-20 w-20 bg-slate-200 animate-pulse rounded' key={"loadingImage"}>
                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                <div className='flex gap-2 lg:flex-col h-full overflow-scroll scrollbar-none h-full'>
                  {
                    data?.productImage?.map((imgURL, index)=>{
                      return (
                        <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                          <img 
                            src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' 
                            onMouseEnter={()=>handleMouseEnterproduct(imgURL)}
                            onClick={()=>handleMouseEnterproduct(imgURL)}
                          />
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          </div>
        </div>

        {/* product details */}
        {
          loading ? (
            <div className='grid gap-1 w-full'>
              <p className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full inline-block'></p> 
              <h2 className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full text-2xl lg:text-4-xl font-medium'></h2>
              <p className='bg-slate-200 animate-pulse h-6 lg:h-8 rounded-full min-w-[100px] capitalize text-slate-400 '></p>

              <div className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full flex text-red-600 items-center gap-1'>
                
              </div>

              <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 w-full'>
                <p className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full text-red-600'></p>
                <p className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full text-slate-400 line-through'></p>
              </div>

              <div className='flex items-center gap-3 my-2 w-full'>
                <button className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full'></button>
                <button className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full'></button>
              </div>

              <div className='w-full'>
                <p className='text-slate-600 font-medium my-1 bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full'></p>
                <p className='bg-slate-200 animate-pulse h-10 lg:h-12 w-full rounded-full'></p>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-1'>
              <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>{data?.brandName}</p> 
              <h2 className='text-2xl lg:text-4-xl font-medium'>{data?.productName}</h2>
              <p className='capitalize text-slate-400 '>{data?.category}</p>

              <div className='flex text-red-600 items-center gap-1'>
                <FaStar/>
                <FaStar/>
                <FaStar/>
                <FaStar/>
                <FaStarHalf/>
              </div>

              <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
                <p className='text-red-600'>{displayUSDCurrency(data?.sellingPrice)}</p>
                <p className='text-slate-400 line-through'>{displayUSDCurrency(data?.price)}</p>
              </div>

              <div className='flex items-center gap-3 my-2'>
                <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-red-600 hover:bg-red-600 hover:text-white'>Buy</button>
                <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-red-600 hover:bg-white hover:text-red-600'>Add To Cart</button>
              </div>

              <div>
                <p className='text-slate-600 font-medium my-1'>Description : </p>
                <p>{data?.description}</p>
              </div>
            </div>
          )
        }
        
      </div>

    </div>
  )
}

export default ProductDetails