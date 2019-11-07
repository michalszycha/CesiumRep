/**
 * This is the outcome of a geodetic calculation. It represents the path and
 * ellipsoidal distance between two GlobalCoordinates for a specified reference
 * ellipsoid.
 * 
 * @author Dominic Graulich, <a href="http://dominic.graulichs.de">http://dominic.graulichs.de</a> (translating to JavaScript)
 * @see Mike Gavaghan (Java and C# version at <a href="http://www.gavaghan.org/blog/free-source-code/">http://www.gavaghan.org/blog/free-source-code/</a>)
 * @version ${project.version}
 */
 
/**
 * Creates a new GeodeticCurve.
 * @class
 * @constructor
 * @param ellipsoidalDistance ellipsoidal distance in meters
 * @param azimuth azimuth in degrees
 * @param reverseAzimuth reverse azimuth in degrees
 */
var GeodeticCurve = function(ellipsoidalDistance, azimuth, reverseAzimuth){
	
	var self = this;

   /** Ellipsoidal distance (in meters). */
   self.mEllipsoidalDistance = ellipsoidalDistance;

   /** Azimuth (degrees from north). */
   self.mAzimuth = azimuth;

   /** Reverse azimuth (degrees from north). */
   self.mReverseAzimuth = reverseAzimuth;

   /**
    * Get the ellipsoidal distance.
		*
		* @methodOf GeodeticCurve#
		* @name getEllipsoidalDistance
		* @public
    * @return ellipsoidal distance in meters
    */
   self.getEllipsoidalDistance = function(){
      return self.mEllipsoidalDistance;
   };

   /**
    * Get the azimuth.
		*
		* @methodOf GeodeticCurve#
		* @name getAzimuth
		* @public
    * @return azimuth in degrees
    */
   self.getAzimuth = function(){
      return self.mAzimuth;
   };

   /**
    * Get the reverse azimuth.
		*
		* @methodOf GeodeticCurve#
		* @name getReverseAzimuth
		* @public
    * @return reverse azimuth in degrees
    */
   self.getReverseAzimuth = function(){
      return self.mReverseAzimuth;
   };

   /**
    * Get curve as a string.
    *
		* @methodOf GeodeticCurve#
		* @name toString
		* @public
		* @return
    */
   self.toString = function(){
      var retVal = "";
      retVal += "s=";
      retVal += self.mEllipsoidalDistance;
      retVal += ";a12=";
      retVal += self.mAzimuth;
      retVal += ";a21=";
      retVal += self.mReverseAzimuth;
      retVal += ";";
      return retVal;
   };
};