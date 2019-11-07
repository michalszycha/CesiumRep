/**
 * <p>
 * Encapsulates a three dimensional location on a globe (GlobalCoordinates
 * combined with an elevation in meters above a reference ellipsoid).
 * </p>
 * <p>
 * See documentation for GlobalCoordinates for details on how latitude and
 * longitude measurements are canonicalized.
 * </p>
 * 
 * @author Dominic Graulich, <a href="http://dominic.graulichs.de">http://dominic.graulichs.de</a> (translating to JavaScript)
 * @see Mike Gavaghan (Java and C# version at <a href="http://www.gavaghan.org/blog/free-source-code/">http://www.gavaghan.org/blog/free-source-code/</a>)
 * @version ${project.version}
 */

/**
 * Creates a new instance of GlobalPosition (<b>multiple signatures</b>).
 * 
 * @class
 * @constructor
 * @param param1 {latitude in degrees | coords coordinates of the position}
 * @param param2 {longitude in degrees | elevation in meters}
 * @param param3 {elevation in meters | undefined}
 */

var GlobalPosition = function(param1, param2, param3){
	
	var self = this;

	self.coordinates = undefined;
	
	/** Elevation, in meters, above the surface of the ellipsoid. */
	self.mElevation = undefined;

	if(typeof param1 == 'number'){
		var latitude = param1;
		var longitude = param2;
		var elevation = param3;
		self.coordinates = new GlobalCoordinates(latitude, longitude);
		self.mElevation = elevation;   
	}else if(param1 instanceof GlobalCoordinates){
		self.coordinates = param1;
		self.mElevation = param2;
	}

	/**
	* Get elevation.
	* 
	* @methodOf GlobalPosition#
	* @name getElevation
	* @public
	* @return elevation about the ellipsoid in meters.
	*/
	self.getElevation = function(){
		return self.mElevation;
	};

	/**
	* Set the elevation.
	*
	* @methodOf GlobalPosition#
	* @name setElevation
	* @public
	* @param elevation elevation about the ellipsoid in meters.
	*/
	self.setElevation = function(elevation){
		self.mElevation = elevation;
	};

	/**
	* Compare this position to another. Western longitudes are less than eastern
	* logitudes. If longitudes are equal, then southern latitudes are less than
	* northern latitudes. If coordinates are equal, lower elevations are less
	* than higher elevations.
	* 
	* @methodOf GlobalPosition#
	* @name compareTo
	* @public
	* @param other instance to compare to
	* @return -1, 0, or +1 as per Comparable contract
	*/
	self.compareTo = function(other){
		var retval = self.coordinates.compareTo(other);
		if (retval === 0){
			 if (self.mElevation < other.mElevation){
					retval = -1;
			 }else if (self.mElevation > other.mElevation){
				 retval = +1;
			 }
		}
		return retval;
	};

	/**
	* Get a hash code for this position.
	*
	* @methodOf GlobalPosition#
	* @name hashCode
	* @public
	* @return
	*/
	self.hashCode = function(){
		var hash = self.coordinates.hashCode();
		if (self.mElevation !== 0){
			hash *= parseInt(''+self.mElevation, 10);
		}
		return hash;
	};

	/**
	* Compare this position to another object for equality.
	*
	* @methodOf GlobalPosition#
	* @name equals
	* @public
	* @param other
	* @return
	*/
	self.equals = function(obj){
		if (!(obj instanceof GlobalPosition)){
			return false;
		}

		var other = obj;
		return (self.mElevation == other.mElevation) && (self.coordinates.equals(other));
	};

	/**
	* Get position as a string.
	* @methodOf GlobalPosition#
	* @name toString
	* @public
	*/
	self.toString = function(){
		var retVal = "";

		retVal += self.coordinates.toString();
		retVal += "elevation=";
		retVal += self.mElevation;
		retVal += "m";

		return retVal;
	};

	/**
	* Canonicalize coordinates
	* @methodOf GlobalPosition#
	* @name canonicalize	
	* @public
	*/
	self.canonicalize = function(){
		self.coordinates.canonicalize();
	};

	/**
	* Get latitude.
	* 
	* @methodOf GlobalPosition#
	* @name getLatitude
	* @public
	* @return latitude in degrees
	*/
	self.getLatitude = function(){
		return self.coordinates.getLatitude();
	};

	/**
	* Set latitude. The latitude value will be canonicalized (which might result
	* in a change to the longitude). Negative latitude is southern hemisphere.
	* 
	* @methodOf GlobalPosition#
	* @name setLatitude
	* @public
	* @param latitude in degrees
	*/
	self.setLatitude = function(latitude){
		self.coordinates.setLatitude(latitude);
	};

	/**
	* Get longitude.
	* 
	* @methodOf GlobalPosition#
	* @name getLongitude
	* @public
	* @return longitude in degrees
	*/
	self.getLongitude = function(){
		return self.coordinates.getLongitude();
	};

	/**
	* Set longitude. The longitude value will be canonicalized. Negative
	* longitude is western hemisphere.
	* 
	* @methodOf GlobalPosition#
	* @name setLongitude
	* @public
	* @param longitude in degrees
	*/
	self.setLongitude = function(longitude){
		self.coordinates.setLongitude(longitude);
	};
};