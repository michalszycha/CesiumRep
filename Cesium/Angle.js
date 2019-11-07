/** 
 * Helper methods to convert between degree and radian.
 *
 * @class
 * @author Dominic Graulich, <a href="http://dominic.graulichs.de">http://dominic.graulichs.de</a> (translating to JavaScript)
 * @see Mike Gavaghan (Java and C# version at <a href="http://www.gavaghan.org/blog/free-source-code/">http://www.gavaghan.org/blog/free-source-code/</a>)
 * @version ${project.version}
 */

var Angle = function(){};

(function _Angle(){
	
	var self = this,
			PiOver180 = Math.PI / 180.0; /** Degrees/Radians conversion constant. */

	/**
    * Convert degrees to radians.
    *
		* @methodOf Angle
		* @name toRadians
		* @param degrees
    * @return
    */
	self.toRadians = function(degrees){
		return degrees * PiOver180;
	};
   
   /**
    * Convert radians to degrees.
		*
		* @methodOf Angle
		* @name toDegrees
    * @param radians
    * @return
    */
   self.toDegrees = function(radians){
      return radians / PiOver180;
   };
   
   Angle = self;
}());