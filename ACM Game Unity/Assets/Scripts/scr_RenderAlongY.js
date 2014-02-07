#pragma strict
// This script ensures that the attatched oject is rendered with a depth
// based on its Y coordinate
function Start () {
	transform.position = Vector3(transform.position.x,transform.position.y,transform.position.y*.001);
}

function FixedUpdate () {
	transform.position = Vector3(transform.position.x,transform.position.y,transform.position.y*.001);
}