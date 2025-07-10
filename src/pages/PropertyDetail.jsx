import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PropertyMap from '../components/PropertyMap';
import FavoriteButton from '../components/FavoriteButton';
import { formatPrice } from '../utils/priceFormatter';
import { useAirtableProperties } from '../hooks/useAirtableProperties';

const {
  FiMapPin, FiNavigation, FiSquare, FiClock, FiCamera, FiArrowLeft,
  FiPhone, FiMail, FiCalendar, FiInfo, FiDollarSign, FiHome,
  FiDatabase, FiExternalLink, FiZoomIn, FiChevronLeft, FiChevronRight
} = FiIcons;

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, loading } = useAirtableProperties();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (properties.length > 0 && id) {
      const foundProperty = properties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
        console.log('✅ Property found:', foundProperty.title);
      } else {
        console.warn('⚠️ Property not found for ID:', id);
      }
    }
  }, [properties, id]);

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const getPropertyTypeLabel = (type) => {
    const types = {
      restaurant: '飲食店',
      retail: '小売店',
      office: 'オフィス',
      warehouse: '倉庫・工場',
      service: 'サービス業',
      residential: '住宅',
      other: 'その他'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <SafeIcon icon={FiHome} className="text-6xl text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              物件が見つかりません
            </h1>
            <p className="text-gray-600 mb-8">
              指定された物件IDの物件データが見つかりませんでした。
            </p>
            <button
              onClick={() => navigate('/search')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              物件検索に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '概要', icon: FiInfo },
    { id: 'details', label: '詳細情報', icon: FiHome },
    { id: 'location', label: 'アクセス', icon: FiMapPin },
    { id: 'contact', label: 'お問い合わせ', icon: FiPhone }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} />
              <span>戻る</span>
            </button>
            <span>/</span>
            <span>物件詳細</span>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="bg-primary-600 text-white px-3 py-1 text-sm font-medium rounded">
                {getPropertyTypeLabel(property.type)}
              </span>
              {property.featured && (
                <span className="bg-red-500 text-white px-3 py-1 text-sm font-medium rounded">
                  おすすめ
                </span>
              )}
              <div className="flex items-center space-x-1 text-sm text-blue-600">
                <SafeIcon icon={FiDatabase} className="text-sm" />
                <span>Airtable連携</span>
              </div>
            </div>
            <FavoriteButton property={property} size="large" />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiMapPin} />
              <span>{property.address}</span>
            </div>
            {property.nearestStation && (
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiNavigation} />
                <span>
                  {property.nearestStation}駅
                  {property.walkingMinutes && ` 徒歩${property.walkingMinutes}分`}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiCalendar} />
              <span>更新: {new Date(property.lastUpdated).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {property.images && property.images.length > 0 && (
          <div className="mb-8">
            <div className="detail-image-container relative group">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - 画像${currentImageIndex + 1}`}
                className="detail-main-image"
                onClick={() => setIsImageModalOpen(true)}
              />
              
              {/* Image Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <SafeIcon icon={FiChevronLeft} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <SafeIcon icon={FiChevronRight} />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
              
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <SafeIcon icon={FiZoomIn} />
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {property.images.length > 1 && (
              <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-primary-600 ring-2 ring-primary-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} サムネイル ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Basic Info */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">物件種別</span>
                        <span className="font-medium">{getPropertyTypeLabel(property.type)}</span>
                      </div>
                      {property.area && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">面積</span>
                          <span className="font-medium">{property.area}㎡</span>
                        </div>
                      )}
                      {property.floor && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">所在階</span>
                          <span className="font-medium">{property.floor}</span>
                        </div>
                      )}
                      {property.structure && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">建物構造</span>
                          <span className="font-medium">{property.structure}</span>
                        </div>
                      )}
                      {property.availability && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">現況</span>
                          <span className="font-medium">{property.availability}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {property.notes && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">物件説明</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {property.notes}
                      </p>
                    </div>
                  )}

                  {/* Train Lines */}
                  {property.trainLines && property.trainLines.length > 0 && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">利用可能路線</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.trainLines.map((line, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Detailed Information */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細情報</h3>
                    <div className="space-y-4">
                      {property.details && Object.entries(property.details).map(([key, value]) => {
                        if (!value || key === 'rawFields') return null;
                        return (
                          <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-600 capitalize">{key}</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'location' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Access Info */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">アクセス情報</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <SafeIcon icon={FiMapPin} className="text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">所在地</div>
                          <div className="text-gray-600">{property.address}</div>
                        </div>
                      </div>
                      
                      {property.nearestStation && (
                        <div className="flex items-start space-x-3">
                          <SafeIcon icon={FiNavigation} className="text-gray-400 mt-1" />
                          <div>
                            <div className="font-medium text-gray-900">最寄駅</div>
                            <div className="text-gray-600">
                              {property.nearestStation}駅
                              {property.walkingMinutes && ` 徒歩${property.walkingMinutes}分`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Map */}
                  {property.coordinates && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">地図</h3>
                      <div className="h-96 rounded-lg overflow-hidden">
                        <PropertyMap
                          properties={[property]}
                          selectedProperty={property}
                          center={property.coordinates}
                          zoom={16}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Contact Info */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">お問い合わせ</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiPhone} className="text-primary-600" />
                        <div>
                          <div className="font-medium">電話でのお問い合わせ</div>
                          <div className="text-primary-600 font-semibold">03-3525-8791</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiMail} className="text-primary-600" />
                        <div>
                          <div className="font-medium">メールでのお問い合わせ</div>
                          <div className="text-primary-600 font-semibold">tenpotokyo@gmail.com</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <p>営業時間: 平日 9:00-18:00</p>
                        <p>定休日: 土日祝日</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - Price & Actions */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <div className="text-center mb-6">
                {property.rent ? (
                  <>
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {formatPrice(property.rent, { showYen: true, showUnit: false })}
                      <span className="text-lg text-gray-500 ml-1">/月</span>
                    </div>
                    {property.deposit && (
                      <div className="text-sm text-gray-600">
                        敷金: {formatPrice(property.deposit, { showYen: true })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-3xl font-bold text-gray-600">賃料応談</div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <a
                  href="tel:03-3525-8791"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiPhone} />
                  <span>電話で問い合わせ</span>
                </a>
                
                <a
                  href={`mailto:tenpotokyo@gmail.com?subject=物件問い合わせ：${property.title}&body=物件ID：${property.id}%0D%0A物件名：${property.title}%0D%0A%0D%0Aお問い合わせ内容：%0D%0A`}
                  className="w-full border border-primary-600 text-primary-600 py-3 px-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiMail} />
                  <span>メールで問い合わせ</span>
                </a>
              </div>

              {/* Property ID */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <div className="text-sm text-gray-500">物件ID</div>
                <div className="font-mono text-sm text-gray-700">{property.id}</div>
              </div>
            </div>

            {/* Airtable Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-800 mb-2">
                <SafeIcon icon={FiDatabase} />
                <span className="font-semibold text-sm">Airtableデータ</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>レコードID: {property.id}</div>
                <div>最終更新: {new Date(property.lastUpdated).toLocaleDateString('ja-JP')}</div>
                <div>データソース: リアルタイム連携</div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {isImageModalOpen && property.images && property.images.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 z-10 hover:bg-opacity-70 transition-all"
              >
                ×
              </button>
              
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - 拡大画像`}
                className="max-w-full max-h-full object-contain"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
                  >
                    <SafeIcon icon={FiChevronLeft} className="text-xl" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
                  >
                    <SafeIcon icon={FiChevronRight} className="text-xl" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;