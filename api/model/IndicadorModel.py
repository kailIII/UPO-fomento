'''
Created on 28/03/2013

@author: alasarr
'''

from model.base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
import base

class IndicadorModel(PostgreSQLModel):
    
    def getIndicador(self, idIndicador, fecha=None):
        sql = "SELECT i.cod_indicador, name_indicador, fecha, capas, leyenda, tam_leyenda, name_familia, tipocheck, sql_centroid_flechas, sql_dato, (select array_agg(fecha) from geoserver.indicador_fecha where cod_indicador = i.cod_indicador) as fechas FROM geoserver.indicador i" \
                " inner join geoserver.indicador_fecha if on i.cod_indicador = if.cod_indicador" \
                 " inner join geoserver.familia f on f.cod_familia = i.cod_familia where i.cod_indicador=%s";
                 
        if(fecha):
            sql +=  " and fecha=%s"
            
        sql +=  " order by fecha"
        
        if(fecha):
            return self.query(sql,[idIndicador,fecha]).row()
        return self.query(sql,[idIndicador]).row()
    
    def getIndicadorData(self, idIndicador, fecha=None):
        conFecha = ""
        arrayCond = [idIndicador]
        
        for f in fecha.split(","):
            conFecha += "fecha=%s or "
            arrayCond.append(f)
        
        conFecha = conFecha[:-3]
        
        sql = "SELECT i.cod_indicador, i.tipo, name_indicador, name_familia, if.leyenda, width, tabla_geom, fecha, sql_dato FROM geoserver.indicador i" \
                " inner join geoserver.indicador_fecha if on i.cod_indicador = if.cod_indicador" \
                 " inner join geoserver.familia f on f.cod_familia = i.cod_familia where i.cod_indicador=%s and (" + conFecha + ") order by fecha";


        
        return self.query(sql,arrayCond).result()

    def getIndicadorGraphics(self, idIndicador, fecha):
        sql = "SELECT gid, sql_dato, tipo, imagen, title FROM geoserver.indicador_grafica" \
                 " where cod_indicador=%s and fecha=%s";
        
        return self.query(sql,[idIndicador,fecha]).result()
    
    
    def getIndicadorLayers(self, idIndicador, fecha):
        conFecha = ""
        arrayCond = [idIndicador]

        for f in fecha.split(","):
            conFecha += "i.fecha=%s or "
            arrayCond.append(f)

        conFecha = conFecha[:-3]

        sql = "SELECT capas FROM geoserver.indicador_fecha i" \
                 " where i.cod_indicador=%s  and (" + conFecha + ") ORDER BY FECHA DESC";
        
        return self.query(sql,arrayCond).result()
    
    
    
    def getDato(self, sql):
        return self.query(sql).result()


    def getNumIndicadores(self):
        sql = "SELECT count(*) as count FROM geoserver.indicador"
        return self.query(sql).row()['count']
    
    def getCentroid(self, tabla,column,id):
        sql = "SELECT ST_X(ST_CENTROID(ST_TRANSFORM(geom,4326))) as lng, ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))) as lat FROM " + tabla + " WHERE " + column + " =%s"
        return self.query(sql,[id]).row()