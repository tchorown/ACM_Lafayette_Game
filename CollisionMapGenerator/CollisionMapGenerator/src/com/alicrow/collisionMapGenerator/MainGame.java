package com.alicrow.collisionMapGenerator;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.Scanner;

import com.badlogic.gdx.ApplicationListener;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.Input.Keys;
import com.badlogic.gdx.InputProcessor;
import com.badlogic.gdx.graphics.GL10;
import com.badlogic.gdx.graphics.GLCommon;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer.ShapeType;
import com.badlogic.gdx.maps.MapLayers;
import com.badlogic.gdx.maps.tiled.TiledMap;
import com.badlogic.gdx.maps.tiled.TiledMapRenderer;
import com.badlogic.gdx.maps.tiled.TiledMapTile;
import com.badlogic.gdx.maps.tiled.TiledMapTileLayer;
import com.badlogic.gdx.maps.tiled.TiledMapTileLayer.Cell;
import com.badlogic.gdx.maps.tiled.TmxMapLoader;
import com.badlogic.gdx.maps.tiled.renderers.OrthogonalTiledMapRenderer;
import com.badlogic.gdx.math.Intersector;
import com.badlogic.gdx.math.Plane;
import com.badlogic.gdx.math.Vector3;

public class MainGame implements ApplicationListener, InputProcessor
{
	OrthographicCamera cam;
	
	float zoom;
	String outputFilename = "Collisions.txt";
	
	
	
	int mapWidth, mapHeight;
	TiledMap map;
	TiledMapRenderer mapRenderer;	// Renders the Tiled map.
	ShapeRenderer shapeRenderer;	// Renders tile borders and physics overlay
	float tileWidth, tileHeight;
	
	boolean collisionMap[][];	// Stores collision properties of all tiles in the map.
	
	private boolean LeftButtonPressed = false;	// Keeps track of whether the left mouse button is currently pressed.
	private boolean RightButtonPressed = false; // keep track of whether the right button is currently pressed
	
	final Plane xyPlane = new Plane(new Vector3(0,0,1), 0);
	
	
	
	@Override public void create()
	{		
		cam = new OrthographicCamera( Gdx.graphics.getWidth(), Gdx.graphics.getHeight() );
		zoom = 1000f / Gdx.graphics.getHeight();
		cam.setToOrtho(false);
		cam.position.set(15, 15, 100);

		//this.map = new TmxMapLoader().load("data/testMap.tmx");
		this.map = new TmxMapLoader().load("data/Tilemap(base64).xml");
		mapRenderer = new OrthogonalTiledMapRenderer(map, 1.0f/map.getProperties().get("tilewidth", Integer.class));
		shapeRenderer = new ShapeRenderer();
		mapWidth = map.getProperties().get("width", Integer.class);
		mapHeight = map.getProperties().get("height", Integer.class);
		tileWidth = ( (TiledMapTileLayer) map.getLayers().get(0)).getTileWidth();
		tileHeight = ( (TiledMapTileLayer) map.getLayers().get(0)).getTileHeight();
		collisionMap = new boolean[mapHeight][mapWidth];
		for (int y = 0; y < mapHeight; ++y)
			for (int x = 0; x < mapWidth; ++x)
				collisionMap[y][x] = false;
		
		load(outputFilename);	// If there's already a physicsmap file there, load it up so we can edit it.
	 
		Gdx.input.setInputProcessor(this);
		
		cam.update();
	}

	
	@Override public void render()
	{
		GLCommon gl = Gdx.gl;
		gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);
		gl.glClear(GL10.GL_COLOR_BUFFER_BIT);
		cam.update();
		
		mapRenderer.setView(cam);
		mapRenderer.render();
		renderTileBorders(cam);
		renderCollisionData(cam);
		
		cameraControl();
	}
	
	/**
	 * renders borders between tiles on the map.
	 */
	private void renderTileBorders(OrthographicCamera cam)
	{
		shapeRenderer.setProjectionMatrix(cam.combined);
		shapeRenderer.begin(ShapeType.Line);
	//	shapeRenderer.setColor(Color.BLACK);
		int startX = 0;
		int startY = 0;
		int endX = map.getProperties().get("width", Integer.class);
		int endY = map.getProperties().get("height", Integer.class);
		for (int x = startX; x <= endX; ++x)
			shapeRenderer.line(x, startY, x, endY);
		for (int y = startY; y <= endY; ++y)
			shapeRenderer.line(startX, y, endX, y);
		shapeRenderer.end();
	}
	
	/**
	 * Renders a visual representation of the collision data.
	 */
	private void renderCollisionData(OrthographicCamera cam)
	{
		shapeRenderer.setProjectionMatrix(cam.combined);
		shapeRenderer.begin(ShapeType.Filled);
		int startX = 0;
		int startY = 0;
		int endX = map.getProperties().get("width", Integer.class);
		int endY = map.getProperties().get("height", Integer.class);
	//	shapeRenderer.setColor(Color.RED);
		for (int y = startY; y < endY; ++y)
			for (int x = startX; x < endX; ++x)
				if (collisionMap[y][x])
					shapeRenderer.rect(x, y, 1, 1);
		shapeRenderer.end();
	}
	
	/**
	 * Moves the camera according to the WASD keys.
	 */
	public void cameraControl() {
		if ( Gdx.input.isKeyPressed(Keys.W)) cam.translate(0f, .1f * zoom );
		if ( Gdx.input.isKeyPressed(Keys.S)) cam.translate(0f, -.1f * zoom );
		if ( Gdx.input.isKeyPressed(Keys.A)) cam.translate(-.1f * zoom , 0f);
		if ( Gdx.input.isKeyPressed(Keys.D)) cam.translate(.1f * zoom , 0f);
	}
	
	/**
	 * Class to display text inside the window.
	 * @author daniel
	 *
	 */
	public class TextDisplay
	{
		SpriteBatch spriteBatch;
		private int textXPosition; private int textYPosition;
		private BitmapFont font;
		
		TextDisplay() {
			spriteBatch = new SpriteBatch();
		}
		
		/** Called at beginning of each render frame. **/
		public void begin() {
			textXPosition = 15;
			textYPosition = Gdx.graphics.getHeight() - 10;
		}
		
		public void writeText(String text)
		{
			font.draw(spriteBatch, text, textXPosition, textYPosition);
			textYPosition -= 15;
		}
	}
	
	
	
	/**
	 * Returns the tile at the specified world coordinates, or null if no such tile (or blank tile).
	 * @param x
	 * @param y
	 * @return the tile at the specified world coordinates, or null if no such tile (or blank tile).
	 */
	private TiledMapTile tileAt(int x, int y)
	{
		if ( x < 0 || x >= mapWidth || y < 0 || y >= mapWidth)
			return null;	// out of bounds
		MapLayers layers = map.getLayers();
		for (int i = 0; i < layers.getCount(); ++i)
		{
			TiledMapTileLayer layer = (TiledMapTileLayer) layers.get(i);
			Cell cell = layer.getCell(x, y);
			if (cell == null)
				continue;	// Some cells may be null, so, 
			TiledMapTile tile = cell.getTile();
			if (tile.getId() != 0)	// ID of 0 means this is a blank tile, so it doesn't count.
				return tile;
		}
		return null;	// Didn't find any non-blank tiles, so return null
	}
	
	public void setCollisionBox(int x, int y, int goal)
	{
		if (goal == 0)
			collisionMap[y][x] = false;
		else
			collisionMap[y][x] = true;
	}
	
	/**
	 * Exports a physicsmap file containing the coordinates of the collision boxes.
	 * @param filename the name of the file to export
	 */
	public void export(String filename)
	{
		try
		{
			PrintWriter writer = new PrintWriter(filename);
			for (int y = 0; y < mapHeight; ++y)
			{
				for (int x = 0; x < mapWidth; ++x)
					if (collisionMap[y][x]) {
						//writer.print(x*tileWidth);
						writer.print(x);
						writer.print(" ");
						//writer.println(y*tileHeight);
						writer.println(y - mapHeight + 1);
					}
			}
			writer.close();
		}
		catch (FileNotFoundException e) {
			System.out.println(e);
		}
	}
	
	/**
	 * Loads an existing physicsmap file.
	 * @param filename the name of the file to load.
	 */
	public void load(String filename)
	{
		try {
			Scanner scanner = new Scanner(new File(filename));	// Create the Scanner
			while (scanner.hasNextFloat()) {
				// Loop through coordinates in the file, setting up collision boxes in proper places.
				//int x = (int) (scanner.nextFloat() / tileWidth);
				//int y = (int) (scanner.nextFloat() / tileHeight);
				int x = (int) scanner.nextFloat();
				int y = (int) scanner.nextFloat() + mapHeight - 1;
				collisionMap[y][x] = true;
			}
			scanner.close();
		}
		catch (FileNotFoundException e) {
			System.out.println(e);
		}
	}
	
	
	private int xWorldLast, yWorldLast;
	@Override public boolean touchDragged (int x, int y, int pointer)
	{
		if (LeftButtonPressed)
		{
			Vector3 worldCoordinates = new Vector3();
			Intersector.intersectRayPlane(cam.getPickRay(x, y), xyPlane, worldCoordinates);
			int xWorld = (int) worldCoordinates.x;
			int yWorld = (int) worldCoordinates.y;
			if (tileAt(xWorld, yWorld) != null && (xWorld != xWorldLast || yWorld != yWorldLast))	// ensure tile is not null, and that it's not the same one we were at last time.
				setCollisionBox(xWorld, yWorld,1);
			xWorldLast = xWorld; yWorldLast = yWorld;
		}
		
		// right
		if (RightButtonPressed)
		{
			Vector3 worldCoordinates = new Vector3();
			Intersector.intersectRayPlane(cam.getPickRay(x, y), xyPlane, worldCoordinates);
			int xWorld = (int) worldCoordinates.x;
			int yWorld = (int) worldCoordinates.y;
			if (tileAt(xWorld, yWorld) != null && (xWorld != xWorldLast || yWorld != yWorldLast))	// ensure tile is not null, and that it's not the same one we were at last time.
				setCollisionBox(xWorld, yWorld,0);
			xWorldLast = xWorld; yWorldLast = yWorld;
		}
		return false;
	}

	
	@Override public boolean touchDown(int screenX, int screenY, int pointer, int button) {
		
		Vector3 worldCoordinates = new Vector3();
		Intersector.intersectRayPlane(cam.getPickRay(screenX, screenY), xyPlane, worldCoordinates);
		int xWorld = (int) worldCoordinates.x;
		int yWorld = (int) worldCoordinates.y;

		switch(button)
		{
		case Input.Buttons.LEFT:
			if (tileAt(xWorld, yWorld) != null) {
				setCollisionBox(xWorld, yWorld,1);
				xWorldLast = xWorld; yWorldLast = yWorld;
			}
			LeftButtonPressed = true;
			break;
			
		// respond to right click.  reverse state of collision box
		case Input.Buttons.RIGHT:
			if (tileAt(xWorld, yWorld) != null) {
				// reverse collision state to 0
				setCollisionBox(xWorld, yWorld,0);
				xWorldLast = xWorld; yWorldLast = yWorld;
			}
			RightButtonPressed = true;
			break;
		}
		
		return false;
	}
	
	@Override public boolean touchUp(int x, int y, int pointer, int button)
	{
		Vector3 worldCoordinates = new Vector3();
		xWorldLast = -1; yWorldLast = -1;
		Intersector.intersectRayPlane(cam.getPickRay(x, y), xyPlane, worldCoordinates);

		switch(button)	// Record which button was released.
		{
		case Input.Buttons.RIGHT:
			RightButtonPressed = false;
			break;
		case Input.Buttons.LEFT:
			LeftButtonPressed = false;
			break;
		}

		return false;
	}
	

	@Override public boolean keyDown(int keycode) {
		switch (keycode)
		{
		case Input.Keys.ENTER:
			export(outputFilename);
			return true;
		}
		
		return false;
	}
	
	// Called when mouse wheel is scrolled.
	@Override public boolean scrolled(int amount) {
		zoom += amount*.1;
		if (zoom < 0) zoom = 0;
		cam.viewportWidth = Gdx.graphics.getWidth() / 100 * zoom;
		cam.viewportHeight = Gdx.graphics.getHeight() / 100 * zoom;
		//cam.position.z = 15 /100f * zoom;
		cam.update();
		return true;
	}

	@Override public void resize(int width, int height) {
		cam.viewportWidth = width / 100 * zoom;
		cam.viewportHeight = height / 100 * zoom;
		cam.update();
	}

	@Override public boolean keyUp(int keycode) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override public boolean keyTyped(char character) {
		// TODO Auto-generated method stub
		return false;
	}

	// Called when mouse is moved without any buttons being pressed
	@Override public boolean mouseMoved(int screenX, int screenY) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override public void pause() {
		// TODO Auto-generated method stub
	}

	@Override public void resume() {
		// TODO Auto-generated method stub
	}

	@Override public void dispose() {
	}
	
}
