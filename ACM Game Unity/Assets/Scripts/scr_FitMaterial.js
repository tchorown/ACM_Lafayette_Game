#pragma strict
/* This code automatically fixes a texture to an object's size, assuming 
 * the object to have size (1,1,d) and 1 = 128 pixels
 *
 */
 
 
function Start () {
	renderer.material.mainTextureScale = new Vector2(transform.lossyScale.x,transform.lossyScale.y);
}

function Update () {

}