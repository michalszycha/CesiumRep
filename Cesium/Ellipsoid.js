	/**
    * <b>Use the static fields like "Ellipsoid.WGS84" to get Ellipsoid instances.</b>
		* <br><br><b><u>To construct new instances, only use</u></b> the methods <b>Ellipsoid.fromAAndInverseF()</b> or <b>Ellipsoid.fromAAndF()</b>.
		* @class
		* @author Dominic Graulich, <a href="http://dominic.graulichs.de">http://dominic.graulichs.de</a> (translating to JavaScript)
		* @see Mike Gavaghan (Java and C# version at <a href="http://www.gavaghan.org/blog/free-source-code/">http://www.gavaghan.org/blog/free-source-code/</a>)
		* @version ${project.version}
    */
var Ellipsoid = function(){};

(function _Ellipsoid(){

	var self = this;
  
	/**
		* Get semi-major axis.
		*
		* Constructs a new Ellipsoid.  This is private to ensure the values are
    * consistent (flattening = 1.0 / inverseFlattening).
		* @methodOf Ellipsoid#
		* @constructs
		* @name constructEllipsoid
		* @private
		* @param semiMajor
    * @param semiMinor
    * @param flattening
    * @param inverseFlattening
		* @return Ellipsoid
		*/
	var constructEllipsoid = function(semiMajor, semiMinor, flattening, inverseFlattening){
		var obj = {};
		
		/** Semi major axis (meters). */
		obj.mSemiMajorAxis = semiMajor;
		/** Semi minor axis (meters). */
		obj.mSemiMinorAxis = semiMinor;
		/** Flattening. */
		obj.mFlattening = flattening;
		/** Inverse flattening. */
		obj.mInverseFlattening = inverseFlattening;

		/**
		* Get semi-major axis.
		*
		* @methodOf Ellipsoid#
		* @name getSemiMajorAxis
		* @public
		* @return semi-major axis (in meters).
		*/
		obj.getSemiMajorAxis = function(){
			return obj.mSemiMajorAxis;
		};

		/**
		 * Get semi-minor axis.
		 *
		 * @methodOf Ellipsoid#
		 * @name getSemiMajorAxis
		 * @public
		 * @return semi-minor axis (in meters).
		 */
		obj.getSemiMinorAxis = function(){
			return obj.mSemiMinorAxis;
		};

		/**
		 * Get flattening
		 *
		 * @methodOf Ellipsoid#
		 * @name getFlattening
		 * @public
		 * @return
		 */
		obj.getFlattening = function(){
			return obj.mFlattening;
		};

		/**
		 * Get inverse flattening.
		 *
		 * @methodOf Ellipsoid#
		 * @name getInverseFlattening
		 * @public
		 * @return
		 */
		obj.getInverseFlattening = function(){
			return obj.mInverseFlattening;
		};

		return obj;
		};

		/**
		* Build an Ellipsoid from the semi major axis measurement and the inverse flattening.
		*
		* @methodOf Ellipsoid#
		* @constructs
		* @name fromAAndInverseF
		* @public
		* @param semiMajor semi major axis (meters)
		* @param inverseFlattening
		* @return
		*/
		self.fromAAndInverseF = function(semiMajor, inverseFlattening){
		 var f = 1.0 / inverseFlattening;
		 var b = (1.0 - f) * semiMajor;
		 return constructEllipsoid(semiMajor, b, f, inverseFlattening);
		};

		/**
		* Build an Ellipsoid from the semi major axis measurement and the flattening.
		*
		* @methodOf Ellipsoid#
		* @constructs
		* @name fromAAndF
		* @public
		* @param semiMajor semi major axis (meters)
		* @param flattening
		* @return
		*/
		self.fromAAndF = function(semiMajor, flattening){
		 var inverseF = 1.0 / flattening;
		 var b = (1.0 - flattening) * semiMajor;
		 return constructEllipsoid(semiMajor, b, flattening, inverseF);
		};

		/** The WGS84 ellipsoid.
		 *
		 * @memberOf Ellipsoid
		 * @public
		 * @type Ellipsoid
		 * @name WGS84
		 */
		self.WGS84 = self.fromAAndInverseF(6378137.0, 298.257223563);

		/** The GRS80 ellipsoid.
		 *
		 * @memberOf Ellipsoid
		 * @public
		 * @type Ellipsoid
		 * @name GRS80
		 */
		self.GRS80 = self.fromAAndInverseF(6378137.0, 298.257222101);

		/** The GRS67 ellipsoid.
		 *
		 * @memberOf Ellipsoid
		 * @public
		 * @type Ellipsoid
		 * @name GRS67
		 */
		self.GRS67 = self.fromAAndInverseF(6378160.0, 298.25);

		/** The ANS ellipsoid.
		 *
		 * @memberOf Ellipsoid
		 * @public
		 * @type Ellipsoid
		 * @name ANS
		 */
		self.ANS = self.fromAAndInverseF(6378160.0, 298.25);

		/** The WGS72 ellipsoid.
		 *
		 * @memberOf Ellipsoid
		 * @public
		 * @type Ellipsoid
		 * @name WGS72
		 */
		self.WGS72 = self.fromAAndInverseF(6378135.0, 298.26);

		/** The Clarke1858 ellipsoid.
		 *
		 * @memberOf Ellipsoid
		 * @public
		 * @type Ellipsoid
		 * @name Clarke1858
		 */
		self.Clarke1858 = self.fromAAndInverseF(6378293.645, 294.26);

		/** The Clarke1880 ellipsoid.
		 *
		 * @memberOf Ellipsoid
		 * @public
		 * @type Ellipsoid
		 * @name Clarke1880
		 */
		self.Clarke1880 = self.fromAAndInverseF(6378249.145, 293.465);

		/** A spherical "ellipsoid".
		 *
		 * @memberOf Ellipsoid
		 * @public
		 * @type Ellipsoid
		 * @name Sphere
		 */
		self.Sphere = self.fromAAndF(6371000, 0.0);

		Ellipsoid = self;
})();