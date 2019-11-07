/**
 * <p>
 * Encapsulation of latitude and longitude coordinates on a globe. Negative
 * latitude is southern hemisphere. Negative longitude is western hemisphere.
 * </p>
 * <p>
 * Any angle may be specified for longtiude and latitude, but all angles will be
 * canonicalized such that:
 * </p>
 * 
 * <pre>
 * -90 &lt;= latitude &lt;= +90 - 180 &lt; longitude &lt;= +180
 * </pre>
 * 
 * @author Dominic Graulich, <a href="http://dominic.graulichs.de">http://dominic.graulichs.de</a> (translating to JavaScript)
 * @see Mike Gavaghan (Java and C# version at <a href="http://www.gavaghan.org/blog/free-source-code/">http://www.gavaghan.org/blog/free-source-code/</a>)
 * @version ${project.version}
 */

 /**
  * Construct a new GlobalCoordinates. Angles will be canonicalized.
  * 
	* @class
	* @constructor
  * @param latitude latitude in degrees
  * @param longitude longitude in degrees
  */
var GlobalCoordinates = function(latitude, longitude){
   
	 var self = this;
	
   /**
		* @methodOf GlobalCoordinates#
		* @name canonicalize
		* @public
    * Canonicalize the current latitude and longitude values such that:
    * 
    * <pre>
    * -90 &lt;= latitude &lt;= +90 - 180 &lt; longitude &lt;= +180
    * </pre>
    */
   self.canonicalize = function(){
      self.mLatitude = (self.mLatitude + 180) % 360;
      if (self.mLatitude < 0){
				self.mLatitude += 360;
			}
      self.mLatitude -= 180;

      if (self.mLatitude > 90){
         self.mLatitude = 180 - self.mLatitude;
         self.mLongitude += 180;
      }else if (self.mLatitude < -90){
         self.mLatitude = -180 - self.mLatitude;
         self.mLongitude += 180;
      }

      self.mLongitude = ((self.mLongitude + 180) % 360);
      if (self.mLongitude <= 0){
				self.mLongitude += 360;
			}
      self.mLongitude -= 180;
   };

   /**
    * Get latitude.
    * 
		* @methodOf GlobalCoordinates#
		* @name getLatitude
		* @public
    * @return latitude in degrees
    */
   self.getLatitude = function(){
      return self.mLatitude;
   };

   /**
    * Set latitude. The latitude value will be canonicalized (which might result
    * in a change to the longitude). Negative latitude is southern hemisphere.
    * 
		* @methodOf GlobalCoordinates#
		* @name setLatitude
		* @public
    * @param latitude in degrees
    */
   self.setLatitude = function(latitude){
      self.mLatitude = latitude;
      self.canonicalize();
   };

   /**
    * Get longitude.
    * 
		* @methodOf GlobalCoordinates#
		* @name getLongitude
		* @public
    * @return longitude in degrees
    */
   self.getLongitude = function(){
      return self.mLongitude;
   };

   /**
    * Set longitude. The longitude value will be canonicalized. Negative
    * longitude is western hemisphere.
    * 
		* @methodOf GlobalCoordinates#
		* @name setLongitude
		* @public
    * @param longitude in degrees
    */
   self.setLongitude = function(longitude){
      self.mLongitude = longitude;
      self.canonicalize();
   };

   /**
    * Compare these coordinates to another set of coordiates. Western longitudes
    * are less than eastern logitudes. If longitudes are equal, then southern
    * latitudes are less than northern latitudes.
    * 
		* @methodOf GlobalCoordinates#
		* @name compareTo
		* @public
    * @param other instance to compare to
    * @return -1, 0, or +1 as per Comparable contract
    */
   self.compareTo = function( /* GlobalCoordinates */ other){
      var retval;

      if 			 (self.mLongitude < other.mLongitude){
				retval = -1;
			}else if (self.mLongitude > other.mLongitude){
				retval = +1;
			}else if (self.mLatitude < other.mLatitude){
				retval = -1;
			}else if (self.mLatitude > other.mLatitude){
				retval = +1;
			}else{
				retval = 0;
			}

      return retval;
   };

   /**
    * Get a hash code for these coordinates.
    * 
		* @methodOf GlobalCoordinates#
		* @name hashCode
		* @public
    * @return
    */
   self.hashCode = function(){
      return (parseInt(''+(self.mLongitude * self.mLatitude * 1000000 + 1021), 10)) * 1000033;
   };

   /**
    * Compare these coordinates to another object for equality.
    * 
		* @methodOf GlobalCoordinates#
		* @name equals
		* @public
    * @param other
    * @return
    */
   self.equals = function( /*Object*/ obj){
      if (!(obj instanceof GlobalCoordinates)){
				return false;
			}
      var other = obj;
      return (self.mLongitude == other.mLongitude) && (self.mLatitude == other.mLatitude);
   };

   /**
    * Get coordinates as a string.
		* @methodOf GlobalCoordinates#
		* @name toString
		* @public
    */
   self.toString = function(){
      var retVal = "";

      retVal += Math.abs(self.mLatitude);
      retVal += (self.mLatitude >= 0) ? 'N' : 'S';
      retVal += ';';
      retVal += Math.abs(self.mLongitude);
      retVal += (self.mLongitude >= 0) ? 'E' : 'W';
      retVal += ';';

      return retVal;
   };
   
   /** Latitude in degrees. Negative latitude is southern hemisphere. */
   self.mLatitude = latitude;

   /** Longitude in degrees. Negative longitude is western hemisphere. */
   self.mLongitude = longitude;
   
   self.canonicalize();
};