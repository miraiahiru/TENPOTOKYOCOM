import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import FavoriteButton from './FavoriteButton';
import {formatPrice} from '../utils/priceFormatter';

const {FiMapPin,FiNavigation,FiSquare,FiClock,FiCamera,FiEye,FiCalendar,FiDatabase} = FiIcons;

const PropertyCard = ({ property, viewMode = 'grid' }) => {
  // 新着物件かどうかを判定（7日以内）
  const isNewProperty = () => {
    if (!property.lastUpdated) return false;
    const updatedDate = new Date(property.lastUpdated);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return updatedDate >= weekAgo;
  };

  // 物件種別のラベル取得
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

  // 画像エラーハンドリング
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group horizontal-card"
      >
        <Link to={`/property/${property.id}`} className="flex h-full">
          {/* Image Section */}
          <div className="image-section relative overflow-hidden">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
                <div className="hidden image-error-placeholder">
                  <SafeIcon icon={FiCamera} className="text-4xl text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">画像なし</span>
                </div>
              </>
            ) : (
              <div className="image-error-placeholder">
                <SafeIcon icon={FiCamera} className="text-4xl text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">画像なし</span>
              </div>
            )}

            {/* Images Count */}
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                <SafeIcon icon={FiCamera} className="text-xs" />
                <span>{property.images.length}</span>
              </div>
            )}

            {/* Featured Badge */}
            {property.featured && (
              <div className="absolute top-3 right-3">
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center space-x-1 animate-pulse">
                  <span>おすすめ</span>
                  {isNewProperty() && <span>• 新着！</span>}
                </span>
              </div>
            )}

            {/* New Badge */}
            {isNewProperty() && !property.featured && (
              <div className="absolute top-3 right-3">
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded animate-pulse">
                  新着！
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="content-section p-6">
            {/* Property Type Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="bg-primary-600 text-white px-3 py-1 text-xs font-medium rounded">
                  {getPropertyTypeLabel(property.type)}
                </span>
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <SafeIcon icon={FiDatabase} className="text-xs" />
                  <span>Airtable</span>
                </div>
              </div>
              <FavoriteButton property={property} size="small" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {property.title}
            </h3>

            {/* Location Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 text-sm">
                <SafeIcon icon={FiMapPin} className="mr-1 flex-shrink-0" />
                <span className="truncate">{property.address}</span>
              </div>
              
              {property.nearestStation && (
                <div className="flex items-center text-gray-600 text-sm">
                  <SafeIcon icon={FiNavigation} className="mr-1 flex-shrink-0" />
                  <span>
                    {property.nearestStation}駅
                    {property.walkingMinutes && ` 徒歩${property.walkingMinutes}分`}
                  </span>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
              {property.area && (
                <div className="flex items-center">
                  <SafeIcon icon={FiSquare} className="mr-1 text-xs" />
                  <span>{property.area}㎡</span>
                </div>
              )}
              
              <div className="flex items-center">
                <SafeIcon icon={FiCalendar} className="mr-1 text-xs" />
                <span>{new Date(property.lastUpdated).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  {property.rent ? (
                    <div className="text-xl font-bold text-primary-600">
                      {formatPrice(property.rent, { showYen: true, showUnit: false })}
                      <span className="text-sm text-gray-500 ml-1">/月</span>
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-gray-600">応談</div>
                  )}
                  
                  {property.deposit && (
                    <div className="text-xs text-gray-500">
                      敷金: {formatPrice(property.deposit, { compact: true })}
                    </div>
                  )}
                </div>
                
                <div className="text-right text-xs text-gray-500">
                  <div>ID: {property.id.substring(0, 8)}...</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View (デフォルト)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group property-card"
    >
      <Link to={`/property/${property.id}`}>
        {/* Image Container */}
        <div className="property-image-container relative">
          {property.images && property.images.length > 0 ? (
            <>
              <img
                src={property.images[0]}
                alt={property.title}
                className="property-image"
                onError={handleImageError}
              />
              <div className="hidden image-error-placeholder">
                <SafeIcon icon={FiCamera} className="text-4xl text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">画像なし</span>
              </div>
            </>
          ) : (
            <div className="image-error-placeholder">
              <SafeIcon icon={FiCamera} className="text-4xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">画像なし</span>
            </div>
          )}

          {/* Images Count */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
              <SafeIcon icon={FiCamera} className="text-xs" />
              <span>{property.images.length}</span>
            </div>
          )}

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center space-x-1 animate-pulse">
                <span>おすすめ</span>
                {isNewProperty() && <span>• 新着！</span>}
              </span>
            </div>
          )}

          {/* New Badge */}
          {isNewProperty() && !property.featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded animate-pulse">
                新着！
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-3 left-3">
            <FavoriteButton property={property} size="small" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Property Type and Source */}
          <div className="flex items-center justify-between mb-3">
            <span className="bg-primary-600 text-white px-3 py-1 text-xs font-medium rounded">
              {getPropertyTypeLabel(property.type)}
            </span>
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <SafeIcon icon={FiDatabase} className="text-xs" />
              <span>Airtable</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="space-y-1 mb-3 text-sm text-gray-600">
            <div className="flex items-center">
              <SafeIcon icon={FiMapPin} className="mr-1 text-xs flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </div>
            
            {property.nearestStation && (
              <div className="flex items-center">
                <SafeIcon icon={FiNavigation} className="mr-1 text-xs flex-shrink-0" />
                <span>
                  {property.nearestStation}駅
                  {property.walkingMinutes && ` 徒歩${property.walkingMinutes}分`}
                </span>
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-3">
              {property.area && (
                <div className="flex items-center">
                  <SafeIcon icon={FiSquare} className="mr-1" />
                  <span>{property.area}㎡</span>
                </div>
              )}
              <div className="flex items-center">
                <SafeIcon icon={FiCalendar} className="mr-1" />
                <span>{new Date(property.lastUpdated).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-t pt-3">
            {property.rent ? (
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-primary-600">
                  {formatPrice(property.rent, { showYen: true, showUnit: false })}
                  <span className="text-sm text-gray-500 ml-1">/月</span>
                </div>
              </div>
            ) : (
              <div className="text-xl font-bold text-gray-600">応談</div>
            )}
            
            {property.deposit && (
              <div className="text-xs text-gray-500 mt-1">
                敷金: {formatPrice(property.deposit, { compact: true })}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;