#pragma strict
/* Camera control
 * By Bret Black
 *
 * This code follows the player around and makes sure that sprites are displayed
 * at the right size.
 */

var target : GameObject;
var zpos : float;

function Start(){
	// make sure that pixels are the right size
	// note the conversion of types.  Without the conversion of the integars
	// the resulting value would be an int, and would round down from 3.55 to 3.
	Camera.main.orthographicSize = (System.Convert.ToInt16(Screen.height)/2.0)/128.0;
}

function Update() {
	// follow the player around the screen
	transform.position.y = target.transform.position.y;
	transform.position.x = target.transform.position.x;
	transform.position.z = zpos;
}