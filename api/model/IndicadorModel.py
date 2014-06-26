'''
Created on 28/03/2013

@author: alasarr
'''

from model.base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
import base

class IndicadorModel(PostgreSQLModel):
    
    def getIndicador(self, idIndicador, fecha=None):
        sql = "SELECT i.cod_indicador, name_indicador, fecha, capas, leyenda, tam_leyenda, name_familia, (select array_agg(fecha) from geoserver.indicador_fecha where cod_indicador = i.cod_indicador) as fechas FROM geoserver.indicador i" \
                " inner join geoserver.indicador_fecha if on i.cod_indicador = if.cod_indicador" \
                 " inner join geoserver.familia f on f.cod_familia = i.cod_familia where i.cod_indicador=%s";
                 
        if(fecha):
            sql +=  " and fecha=%s"
            
        sql +=  " order by fecha"
        
        if(fecha):
            return self.query(sql,[idIndicador,fecha]).row()
        return self.query(sql,[idIndicador]).row()
    
    def getIndicadorData(self, idIndicador, fecha=None):
        sql = "SELECT i.cod_indicador, name_indicador, name_familia, if.leyenda, sql_dato FROM geoserver.indicador i" \
                " inner join geoserver.indicador_fecha if on i.cod_indicador = if.cod_indicador" \
                 " inner join geoserver.familia f on f.cod_familia = i.cod_familia where i.cod_indicador=%s and fecha=%s";
        
        return self.query(sql,[idIndicador,fecha]).row()
    
    
    def getIndicadorLayers(self, idIndicador, fecha=None):
        sql = "SELECT capas FROM geoserver.indicador_fecha i" \
                 " where i.cod_indicador=%s and i.fecha=%s";
        
        return self.query(sql,[idIndicador,fecha]).row()
    
    
    
    def getDato(self, sql):
        return self.query(sql).result()


    def getNumIndicadores(self):
        sql = "SELECT count(*) as count FROM geoserver.indicador"
        return self.query(sql).row()['count']